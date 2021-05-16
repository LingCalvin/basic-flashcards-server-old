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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
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
  async findAll() {
    return this.decks.findAll({});
  }

  @Get(':id')
  async findOne(@Param() { id }: FindOneDeckDto) {
    const deck = await this.decks.findOne({ id });
    if (!deck) {
      throw new NotFoundException();
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
