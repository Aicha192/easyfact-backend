import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { FacturesModule } from './factures/factures.module';
import { ProduitsModule } from './produits/produits.module';
import { AuthModule } from './auth/auth.module';
import { ProformasModule } from './proformas/proformas.module';
import { ParametresModule } from './parametres/parametres.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({
  isGlobal: true,
}),
    UsersModule, ClientsModule, FacturesModule, ProduitsModule, AuthModule, ProformasModule, ParametresModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
