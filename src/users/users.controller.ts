import { User } from '.prisma/client';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  @Post()
  @Throttle(
    +process.env.AUTHENTICATION_THROTTLE_LIMIT,
    +process.env.AUTHENTICATION_THROTTLE_TTL,
  )
  async register(@Body() dto: RegisterDto) {
    if (
      await this.prisma.user.findFirst({
        where: { username: { equals: dto.username, mode: 'insensitive' } },
      })
    ) {
      throw new ConflictException(
        `An account with username "${dto.username}" already exists.`,
      );
    }
    const user = await this.usersService.create(dto);
    const result: Omit<User, 'password' | 'check'> = {
      id: user.id,
      username: user.username,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return result;
  }

  // TODO: Restrict this endpoint and add one for retrieving usernames only
  @Get(':id')
  async findOne(@Param() { id }: FindOneUserDto) {
    const user = await this.usersService.findOne({ id });
    if (!user) {
      throw new NotFoundException();
    }
    return { id: user.id, username: user.username, active: user.active };
  }
}
