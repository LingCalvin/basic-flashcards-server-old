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
        cards: { createMany: { data: cards } },
      },
      include: { cards: true },
    });
  }

  findAll(params: Prisma.DeckFindManyArgs): Promise<Deck[]> {
    return this.prisma.deck.findMany(params);
  }

  findOne(where: Prisma.DeckWhereUniqueInput): Promise<Deck | null> {
    return this.prisma.deck.findUnique({ where, include: { cards: true } });
  }

  async update(id: string, dto: UpdateDeckDto): Promise<Deck> {
    const updatedCardIds: string[] = [];

    const updatedCards: Prisma.CardUpsertWithWhereUniqueWithoutDeckInput[] = [];
    const createdCards: Prisma.CardCreateWithoutDeckInput[] = [];

    dto.cards.forEach((card) => {
      const cardData = { frontText: card.frontText, backText: card.backText };
      if (card.id !== undefined) {
        updatedCards.push({
          where: { id: card.id },
          create: card,
          update: cardData,
        });
        updatedCardIds.push(card.id);
      } else {
        createdCards.push(cardData);
      }
    });

    return this.prisma.deck.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        visibility: dto.visibility,
        cards: {
          // Delete cards which are no longer in the deck
          deleteMany: { id: { notIn: updatedCardIds } },
          // Update existing cards that are still in the deck
          upsert: updatedCards,
          // Add the new cards
          create: createdCards,
        },
      },
      include: { cards: true },
    });
  }

  async remove(where: Prisma.DeckWhereUniqueInput): Promise<Deck> {
    const [, deck] = await this.prisma.$transaction([
      this.prisma.card.deleteMany({ where: { deckId: where.id } }),
      this.prisma.deck.delete({ where, include: { cards: true } }),
    ]);
    return deck;
  }
}
