import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { Deck } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

  create({
    authorId,
    title,
    description,
    visibility,
    cards,
  }: CreateDeckDto): Promise<Deck> {
    return this.prisma.deck.create({
      data: {
        author: { connect: { id: authorId } },
        title,
        description,
        visibility,
        cards: {
          createMany: {
            data: cards.map((card, position) => ({ ...card, position })),
          },
        },
      },
      include: { cards: { orderBy: { position: 'asc' } } },
    });
  }

  async findAll(
    params: Prisma.DeckFindManyArgs,
  ): Promise<{ decks: Deck[]; count: number }> {
    const [count, decks] = await this.prisma.$transaction([
      this.prisma.deck.count({ where: params.where }),
      this.prisma.deck.findMany(params),
    ]);
    return { decks, count };
  }

  findOne(where: Prisma.DeckWhereUniqueInput): Promise<Deck | null> {
    return this.prisma.deck.findUnique({
      where,
      include: { cards: { orderBy: { position: 'asc' } } },
    });
  }

  async update(id: string, dto: UpdateDeckDto): Promise<Deck> {
    const updatedCards: Prisma.CardUpsertWithWhereUniqueWithoutDeckInput[] = [];
    const createdCards: Prisma.CardCreateWithoutDeckInput[] = [];

    dto.cards.forEach((card, position) => {
      const cardData = {
        frontText: card.frontText,
        backText: card.backText,
        position,
      };
      if (card.id !== undefined) {
        updatedCards.push({
          where: { id: card.id },
          create: { ...card, position },
          update: cardData,
        });
      } else {
        createdCards.push(cardData);
      }
    });

    const [, deck] = await this.prisma.$transaction([
      this.prisma.card.deleteMany({ where: { deckId: id } }),
      this.prisma.deck.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          visibility: dto.visibility,
          cards: {
            // Update existing cards that are still in the deck
            upsert: updatedCards,
            // Add the new cards
            create: createdCards,
          },
        },
        include: { cards: { orderBy: { position: 'asc' } } },
      }),
    ]);

    return deck;
  }

  async remove(where: Prisma.DeckWhereUniqueInput): Promise<Deck> {
    const [, deck] = await this.prisma.$transaction([
      this.prisma.card.deleteMany({ where: { deckId: where.id } }),
      this.prisma.deck.delete({ where }),
    ]);
    return deck;
  }
}
