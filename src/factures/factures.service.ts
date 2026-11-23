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
    client: string;
    items: {
      designation: string;
      quantite: number;
      prixUnitaire: number;
    }[];
    dateEmission: string;
    dateEcheance: string;
    tva: number;
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

  const annee = new Date().getFullYear();

  const result = await this.prisma.$transaction(async (tx) => {
    const sequence = await tx.factureSequence.upsert({
      where: {
        entrepriseId_annee: {
          entrepriseId,
          annee,
        },
      },
      create: {
        entrepriseId,
        annee,
        dernierNumero: 1,
      },
      update: {
        dernierNumero: {
          increment: 1,
        },
      },
    });

    const numero = `FAC-${annee}-${String(sequence.dernierNumero).padStart(4, '0')}`;

    const newFacture = await tx.facture.create({
      data: {
        numero,
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

    return newFacture;
  });

  return {
    message: 'Facture créée avec succès',
    facture: result,
  };
}

async updateFacture(
  id: number,
  facture: {
    client: string;
    items: {
      designation: string;
      quantite: number;
      prixUnitaire: number;
    }[];
    dateEmission: string;
    dateEcheance: string;
    tva: number;
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

  const result = await this.prisma.$transaction(async (tx) => {
    const updateResult = await tx.facture.updateMany({
      where: {
        id,
        entrepriseId,
      },
      data: {
        client: facture.client,
        dateEmission: new Date(facture.dateEmission),
        dateEcheance: new Date(facture.dateEcheance),
        montantHT,
        tva: facture.tva,
        montantTTC,
        statut: facture.statut,
        notes: facture.notes,
      },
    });

    if (updateResult.count === 0) {
      throw new NotFoundException('Facture introuvable');
    }

    await tx.factureItem.deleteMany({
      where: {
        factureId: id,
        facture: {
          entrepriseId,
        },
      },
    });

    await tx.factureItem.createMany({
      data: items.map((item) => ({
        ...item,
        factureId: id,
      })),
    });

    return tx.facture.findFirst({
      where: {
        id,
        entrepriseId,
      },
      include: {
        items: true,
      },
    });
  });

  return {
    message: 'Facture modifiée avec succès',
    facture: result,
  };
}

async deleteFacture(id: number, entrepriseId: number) {
  const result = await this.prisma.facture.deleteMany({
    where: {
      id,
      entrepriseId,
    },
  });

  if (result.count === 0) {
    throw new NotFoundException('Facture introuvable');
  }

  return {
    message: 'Facture supprimée avec succès',
    factureId: id,
  };
 }
}
