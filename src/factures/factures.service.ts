import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacturesService {
  constructor(private readonly prisma: PrismaService) {}

  async getFactures(entrepriseId: number) {
    return this.prisma.facture.findMany({
      where: {
        entrepriseId,
      },
      include: {
        items: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async createFacture(
    facture: {
      numero: string;
      client: string;
      items: {
        designation: string;
        quantite: number;
        prixUnitaire: number;
        total: number;
      }[];
      dateEmission: string;
      dateEcheance: string;
      montantHT: number;
      tva: number;
      montantTTC: number;
      statut: 'Brouillon' | 'Envoyée' | 'Payée' | 'En retard';
      notes?: string;
    },
    entrepriseId: number,
  ) {
    const items = facture.items.map((item) => ({
      designation: item.designation,
      quantite: item.quantite,
      prixUnitaire: item.prixUnitaire,
      total: item.quantite * item.prixUnitaire,
    }));

    const montantHT = items.reduce((total, item) => total + item.total, 0);

    const montantTTC = montantHT + (montantHT * facture.tva) / 100;

    const newFacture = await this.prisma.facture.create({
      data: {
        numero: facture.numero,
        client: facture.client,
        dateEmission: new Date(facture.dateEmission),
        dateEcheance: new Date(facture.dateEcheance),
        montantHT,
        tva: facture.tva,
        montantTTC,
        statut: facture.statut,
        notes: facture.notes,
        entrepriseId,

        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    return {
      message: 'Facture créée avec succès',
      facture: newFacture,
    };
  }

  async updateFacture(
    id: number,
    facture: {
      numero: string;
      client: string;
      items: {
        id: number;
        designation: string;
        quantite: number;
        prixUnitaire: number;
        total: number;
      }[];
      dateEmission: string;
      dateEcheance: string;
      montantHT: number;
      tva: number;
      montantTTC: number;
      statut: 'Brouillon' | 'Envoyée' | 'Payée' | 'En retard';
      notes?: string;
    },
    entrepriseId: number,
  ) {
    const existingFacture = await this.prisma.facture.findFirst({
      where: {
        id,
        entrepriseId,
      },
    });

    if (!existingFacture) {
      throw new NotFoundException('Facture introuvable');
    }

    const items = facture.items.map((item) => ({
      designation: item.designation,
      quantite: item.quantite,
      prixUnitaire: item.prixUnitaire,
      total: item.quantite * item.prixUnitaire,
    }));

    const montantHT = items.reduce((total, item) => total + item.total, 0);

    const montantTTC = montantHT + (montantHT * facture.tva) / 100;

    const updatedFacture = await this.prisma.facture.update({
      where: {
        id,
      },
      data: {
        numero: facture.numero,
        client: facture.client,
        dateEmission: new Date(facture.dateEmission),
        dateEcheance: new Date(facture.dateEcheance),
        montantHT,
        tva: facture.tva,
        montantTTC,
        statut: facture.statut,
        notes: facture.notes,

        items: {
          deleteMany: {},

          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    return {
      message: 'Facture modifiée avec succès',
      facture: updatedFacture,
    };
  }

  async deleteFacture(id: number, entrepriseId: number) {
    const existingFacture = await this.prisma.facture.findFirst({
      where: {
        id,
        entrepriseId,
      },
    });

    if (!existingFacture) {
      throw new NotFoundException('Facture introuvable');
    }

    await this.prisma.facture.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Facture supprimée avec succès',
      factureId: id,
    };
  }
}
