import { User, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ username, password }: RegisterDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        username,
        password: await argon2.hash(password, { type: argon2.argon2id }),
        check: uuidv4(),
      },
    });
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }
}
