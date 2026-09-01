import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  getClients(@Req() request: any) {
    return this.clientsService.getClients(
      request.user.entrepriseId,
    );
  }

  @Post()
  createClient(
    @Req() request: any,
    @Body()
    client: {
      nom: string;
      email: string;
      telephone: string;
      adresse: string;
      statut: 'Actif' | 'Inactif';
    },
  ) {
    return this.clientsService.createClient(
      client,
      request.user.entrepriseId,
    );
  }

  @Put(':id')
  updateClient(
    @Req() request: any,
    @Param('id') id: string,
    @Body()
    client: {
      nom: string;
      email: string;
      telephone: string;
      adresse: string;
      statut: 'Actif' | 'Inactif';
    },
  ) {
    return this.clientsService.updateClient(
      Number(id),
      client,
      request.user.entrepriseId,
    );
  }

  @Delete(':id')
  deleteClient(
    @Req() request: any,
    @Param('id') id: string,
  ) {
    return this.clientsService.deleteClient(
      Number(id),
      request.user.entrepriseId,
    );
  }
}