import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getClients(entrepriseId: number) {
    return this.prisma.client.findMany({
      where: {
        entrepriseId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async createClient(
    client: {
      nom: string;
      email: string;
      telephone: string;
      adresse: string;
      statut: 'Actif' | 'Inactif';
    },
    entrepriseId: number,
  ) {
    const newClient = await this.prisma.client.create({
      data: {
        ...client,
        entrepriseId,
      },
    });

    return {
      message: 'Client créé avec succès',
      client: newClient,
    };
  }

  async updateClient(
    id: number,
    client: {
      nom: string;
      email: string;
      telephone: string;
      adresse: string;
      statut: 'Actif' | 'Inactif';
    },
    entrepriseId: number,
  ) {
    const existingClient = await this.prisma.client.findFirst({
      where: {
        id,
        entrepriseId,
      },
    });

    if (!existingClient) {
      throw new NotFoundException(
        'Client introuvable ou non accessible.',
      );
    }

    const updatedClient = await this.prisma.client.update({
      where: {
        id,
      },
      data: client,
    });

    return {
      message: 'Client modifié avec succès',
      client: updatedClient,
    };
  }

  async deleteClient(id: number, entrepriseId: number) {
    const existingClient = await this.prisma.client.findFirst({
      where: {
        id,
        entrepriseId,
      },
    });

    if (!existingClient) {
      throw new NotFoundException(
        'Client introuvable ou non accessible.',
      );
    }

    await this.prisma.client.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Client supprimé avec succès',
      clientId: id,
    };
  }
}