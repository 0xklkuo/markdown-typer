import { Module } from '@nestjs/common';

import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [PrismaModule, NotesModule],
  controllers: [HealthController],
})
export class AppModule { }
