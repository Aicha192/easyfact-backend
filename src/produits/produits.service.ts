import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProduitsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProduits(entrepriseId: number) {
    return this.prisma.produit.findMany({
      where: {
        entrepriseId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async createProduit(
    produit: {
      reference: string;
      nom: string;
      categorie: 'Produit' | 'Service';
      prix: number;
      unite: string;
      statut: 'Actif' | 'Inactif';
    },
    entrepriseId: number,
  ) {
    const newProduit = await this.prisma.produit.create({
      data: {
        ...produit,
        entrepriseId,
      },
    });

    return {
      message: 'Produit créé avec succès',
      produit: newProduit,
    };
  }

  async updateProduit(
    id: number,
    produit: {
      reference: string;
      nom: string;
      categorie: 'Produit' | 'Service';
      prix: number;
      unite: string;
      statut: 'Actif' | 'Inactif';
    },
    entrepriseId: number,
  ) {
    const existingProduit = await this.prisma.produit.findFirst({
      where: {
        id,
        entrepriseId,
      },
    });

    if (!existingProduit) {
      throw new NotFoundException('Produit introuvable');
    }

    const updatedProduit = await this.prisma.produit.update({
      where: {
        id,
      },
      data: produit,
    });

    return {
      message: 'Produit modifié avec succès',
      produit: updatedProduit,
    };
  }

  async deleteProduit(id: number, entrepriseId: number) {
    const existingProduit = await this.prisma.produit.findFirst({
      where: {
        id,
        entrepriseId,
      },
    });

    if (!existingProduit) {
      throw new NotFoundException('Produit introuvable');
    }

    await this.prisma.produit.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Produit supprimé avec succès',
      produitId: id,
    };
  }
}