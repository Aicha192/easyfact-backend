import { Injectable, NotFoundException } from '@nestjs/common';
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
      id: number;
      designation: string;
      quantite: number;
      prixUnitaire: number;
      total: number;
    }[];
    dateEmission: string;
    dateValidite: string;
    montantHT: number;
    tva: number;
    montantTTC: number;
    statut:
      | 'Brouillon'
      | 'Envoyée'
      | 'Acceptée'
      | 'Refusée'
      | 'Expirée';
    notes?: string;
    factureNumero?: string;
  },
  entrepriseId: number,
) {
  const newProforma = await this.prisma.proforma.create({
    data: {
      numero: proforma.numero,
      client: proforma.client,
      dateEmission: new Date(proforma.dateEmission),
      dateValidite: new Date(proforma.dateValidite),
      montantHT: proforma.montantHT,
      tva: proforma.tva,
      montantTTC: proforma.montantTTC,
      statut: proforma.statut,
      notes: proforma.notes,
      factureNumero: proforma.factureNumero,

      entrepriseId,

      items: {
        create: proforma.items.map((item) => ({
          designation: item.designation,
          quantite: item.quantite,
          prixUnitaire: item.prixUnitaire,
          total: item.total,
        })),
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
}

 async updateProforma(
  id: number,
  proforma: {
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
    dateValidite: string;
    montantHT: number;
    tva: number;
    montantTTC: number;
    statut:
      | 'Brouillon'
      | 'Envoyée'
      | 'Acceptée'
      | 'Refusée'
      | 'Expirée';
    notes?: string;
    factureNumero?: string;
  },
  entrepriseId: number,
) {
  const existingProforma = await this.prisma.proforma.findFirst({
    where: {
      id,
      entrepriseId,
    },
  });

  if (!existingProforma) {
    throw new Error('Proforma introuvable pour cette entreprise');
  }

  const updatedProforma = await this.prisma.proforma.update({
    where: {
      id,
    },
    data: {
      numero: proforma.numero,
      client: proforma.client,
      dateEmission: new Date(proforma.dateEmission),
      dateValidite: new Date(proforma.dateValidite),
      montantHT: proforma.montantHT,
      tva: proforma.tva,
      montantTTC: proforma.montantTTC,
      statut: proforma.statut,
      notes: proforma.notes,
      factureNumero: proforma.factureNumero,

      items: {
        deleteMany: {},
        create: proforma.items.map((item) => ({
          designation: item.designation,
          quantite: item.quantite,
          prixUnitaire: item.prixUnitaire,
          total: item.total,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return {
    message: 'Proforma modifiée avec succès',
    proforma: updatedProforma,
  };
}

  async deleteProforma(id: number, entrepriseId: number) {
  const existingProforma = await this.prisma.proforma.findFirst({
    where: {
      id,
      entrepriseId,
    },
  });

  if (!existingProforma) {
    throw new NotFoundException('Proforma introuvable');
  }

  await this.prisma.proforma.delete({
    where: {
      id,
    },
  });

  return {
    message: 'Proforma supprimée avec succès',
    proformaId: id,
  };
}
}