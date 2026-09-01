import { Module } from '@nestjs/common';
import { ProformasController } from './proformas.controller';
import { ProformasService } from './proformas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProformasController],
  providers: [ProformasService],
})
export class ProformasModule {}