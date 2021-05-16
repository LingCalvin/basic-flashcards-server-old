import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';

@Module({
  providers: [DecksService],
  imports: [PrismaModule],
  controllers: [DecksController],
})
export class DecksModule {}
