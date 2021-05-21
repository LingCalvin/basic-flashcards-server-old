import { DeckVisibility } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import OptionalJwtAuthGuard from 'src/auth/guards/optional-jwt-auth.guard';
import { NIL } from 'uuid';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { FindAllDecksDto } from './dto/find-all-decks.dto';
import { FindOneDeckDto } from './dto/find-one-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';

@Controller('decks')
export class DecksController {
  constructor(private decks: DecksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request,
    @Body()
    dto: CreateDeckDto,
  ) {
    if (req.user.id !== dto.authorId) {
      throw new ForbiddenException();
    }
    return this.decks.create(dto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Req() req: Request, @Query() dto: FindAllDecksDto) {
    const queryMode = dto.caseInsensitive ? 'insensitive' : 'default';
    return this.decks.findAll({
      where: {
        OR: [
          {
            title: {
              equals: dto.titleEquals,
              contains: dto.titleContains,
              mode: queryMode,
            },
            description: { contains: dto.descriptionContains, mode: queryMode },
            visibility: 'PUBLIC',
          },
          {
            authorId: req.user?.id ?? NIL,
            title: {
              equals: dto.titleEquals,
              contains: dto.titleContains,
              mode: queryMode,
            },
            description: { contains: dto.descriptionContains, mode: queryMode },
            visibility: 'PRIVATE',
          },
        ],
      },
      orderBy: { title: dto.orderTitleBy },
      include: { cards: true },
      skip: dto.skip,
      take: dto.take ?? 10,
    });
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Req() req: Request, @Param() { id }: FindOneDeckDto) {
    const deck = await this.decks.findOne({ id });
    if (!deck) {
      throw new NotFoundException();
    }
    if (
      deck.visibility === DeckVisibility.PRIVATE &&
      deck.authorId !== req.user?.id
    ) {
      throw new ForbiddenException();
    }
    return deck;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() { user: { id: userId } }: Request,
    @Param() { id }: FindOneDeckDto,
    @Body()
    dto: UpdateDeckDto,
  ) {
    const deck = await this.decks.findOne({ id });
    if (userId !== deck.authorId) {
      throw new ForbiddenException();
    }

    return this.decks.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Req() { user: { id: userId } }: Request,
    @Param() { id }: FindOneDeckDto,
  ) {
    const deck = await this.decks.findOne({ id });
    if (!deck) {
      throw new NotFoundException();
    }
    if (userId !== deck.authorId) {
      throw new ForbiddenException();
    }
    return this.decks.remove({ id });
  }
}
