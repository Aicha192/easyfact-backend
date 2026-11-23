import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProformasService {
  constructor(private readonly prisma: PrismaService) {}
  async getProformas(entrepriseId: number) {
    return this.prisma.proforma.findMany({
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
  async createProforma(
   proforma: {
  numero: string;
  client: string;
  items: {
    designation: string;
    quantite: number;
    prixUnitaire: number;
  }[];
  dateEmission: string;
  dateValidite: string;
  tva: number;
  statut: 'Brouillon' | 'Envoyée' | 'Acceptée' | 'Refusée' | 'Expirée';
  notes?: string;
  factureNumero?: string;
},
    entrepriseId: number,
  ) {
    const items = proforma.items.map((item) => ({
      designation: item.designation,
      quantite: item.quantite,
      prixUnitaire: item.prixUnitaire,
      total: item.quantite * item.prixUnitaire,
    }));

    const montantHT = items.reduce((total, item) => total + item.total, 0);

    const montantTTC = montantHT + (montantHT * proforma.tva) / 100;
    try {
      const newProforma = await this.prisma.proforma.create({
        data: {
          numero: proforma.numero,
          client: proforma.client,
          dateEmission: new Date(`${proforma.dateEmission}T00:00:00`),
          dateValidite: new Date(`${proforma.dateValidite}T00:00:00`),
          montantHT,
          tva: proforma.tva,
          montantTTC,
          statut: proforma.statut,
          notes: proforma.notes,
          factureNumero: proforma.factureNumero,

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
        message: 'Proforma créée avec succès',
        proforma: newProforma,
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException(
          'Cette facture est déjà liée à une autre proforma.',
        );
      }

      throw error;
    }
  }

async updateProforma(
  id: number,
  proforma: {
    numero: string;
    client: string;
    items: {
      designation: string;
      quantite: number;
      prixUnitaire: number;
    }[];
    dateEmission: string;
    dateValidite: string;
    tva: number;
    statut: 'Brouillon' | 'Envoyée' | 'Acceptée' | 'Refusée' | 'Expirée';
    notes?: string;
    factureNumero?: string;
  },
  entrepriseId: number,
) {
  const items = proforma.items.map((item) => ({
    designation: item.designation,
    quantite: item.quantite,
    prixUnitaire: item.prixUnitaire,
    total: item.quantite * item.prixUnitaire,
  }));

  const montantHT = items.reduce((total, item) => total + item.total, 0);
  const montantTTC = montantHT + (montantHT * proforma.tva) / 100;

  const result = await this.prisma.$transaction(async (tx) => {
    const updateResult = await tx.proforma.updateMany({
      where: {
        id,
        entrepriseId,
      },
      data: {
        numero: proforma.numero,
        client: proforma.client,
        dateEmission: new Date(proforma.dateEmission),
        dateValidite: new Date(proforma.dateValidite),
        montantHT,
        tva: proforma.tva,
        montantTTC,
        statut: proforma.statut,
        notes: proforma.notes,
        factureNumero: proforma.factureNumero,
      },
    });

    if (updateResult.count === 0) {
      throw new NotFoundException('Proforma introuvable');
    }

    await tx.proformaItem.deleteMany({
      where: {
        proformaId: id,
        proforma: {
          entrepriseId,
        },
      },
    });

    await tx.proformaItem.createMany({
      data: items.map((item) => ({
        ...item,
        proformaId: id,
      })),
    });

    return tx.proforma.findFirst({
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
    message: 'Proforma modifiée avec succès',
    proforma: result,
  };
}

async deleteProforma(id: number, entrepriseId: number) {
  const result = await this.prisma.proforma.deleteMany({
    where: {
      id,
      entrepriseId,
    },
  });

  if (result.count === 0) {
    throw new NotFoundException('Proforma introuvable');
  }

  return {
    message: 'Proforma supprimée avec succès',
    proformaId: id,
  };
 }
}
