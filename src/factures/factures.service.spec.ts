
jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacturesService } from './factures.service';

describe('FacturesService - isolation des entreprises', () => {
  let service: FacturesService;

  const transactionMock = {
    facture: {
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
    factureItem: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    factureSequence: {
      upsert: jest.fn(),
    },
  };

  const prismaMock = {
    facture: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    prismaMock.$transaction.mockImplementation(
      async (callback) => callback(transactionMock),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<FacturesService>(FacturesService);
  });

  const factureData = {
    client: 'Client Test',
    items: [
      {
        designation: 'Ordinateur',
        quantite: 2,
        prixUnitaire: 100000,
      },
    ],
    dateEmission: '2026-11-20',
    dateEcheance: '2026-12-20',
    tva: 18,
    statut: 'Brouillon' as const,
    notes: 'Test facture',
  };

  it('récupère uniquement les factures de l’entreprise connectée', async () => {
    transactionMock.facture.findMany.mockResolvedValue([]);

    prismaMock.facture.findMany.mockResolvedValue([]);

    await service.getFactures(6);

    expect(prismaMock.facture.findMany).toHaveBeenCalledWith({
      where: { entrepriseId: 6 },
      include: { items: true },
      orderBy: { id: 'asc' },
    });
  });

  it('refuse de modifier une facture qui ne correspond pas à l’entreprise connectée', async () => {
    transactionMock.facture.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.updateFacture(20, factureData, 6),
    ).rejects.toThrow(NotFoundException);

    expect(transactionMock.facture.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 20, entrepriseId: 6 },
      }),
    );

    expect(transactionMock.factureItem.deleteMany).not.toHaveBeenCalled();
    expect(transactionMock.factureItem.createMany).not.toHaveBeenCalled();
  });

  it('modifie une facture appartenant à l’entreprise connectée', async () => {
    const updatedFacture = {
      id: 20,
      ...factureData,
      entrepriseId: 6,
    };

    transactionMock.facture.updateMany.mockResolvedValue({ count: 1 });
    transactionMock.factureItem.deleteMany.mockResolvedValue({ count: 1 });
    transactionMock.factureItem.createMany.mockResolvedValue({ count: 1 });
    transactionMock.facture.findFirst.mockResolvedValue(updatedFacture);

    const result = await service.updateFacture(20, factureData, 6);

    expect(transactionMock.facture.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 20, entrepriseId: 6 },
      }),
    );

    expect(transactionMock.factureItem.deleteMany).toHaveBeenCalledWith({
      where: {
        factureId: 20,
        facture: { entrepriseId: 6 },
      },
    });

    expect(transactionMock.factureItem.createMany).toHaveBeenCalledWith({
      data: [
        {
          designation: 'Ordinateur',
          quantite: 2,
          prixUnitaire: 100000,
          total: 200000,
          factureId: 20,
        },
      ],
    });

    expect(result.facture).toEqual(updatedFacture);
  });

  it('refuse de supprimer une facture qui ne correspond pas à l’entreprise connectée', async () => {
    prismaMock.facture.deleteMany.mockResolvedValue({ count: 0 });

    await expect(
      service.deleteFacture(20, 6),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.facture.deleteMany).toHaveBeenCalledWith({
      where: { id: 20, entrepriseId: 6 },
    });
  });

  it('supprime une facture appartenant à l’entreprise connectée', async () => {
    prismaMock.facture.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.deleteFacture(20, 6);

    expect(result).toEqual({
      message: 'Facture supprimée avec succès',
      factureId: 20,
    });
  });

it('crée une facture avec un numéro séquentiel et ses lignes', async () => {
  transactionMock.factureSequence.upsert.mockResolvedValue({
    dernierNumero: 3,
  });

  const createdFacture = {
    id: 21,
    numero: `FAC-${new Date().getFullYear()}-0003`,
    entrepriseId: 6,
    ...factureData,
  };

  transactionMock.facture.create.mockResolvedValue(createdFacture);

  const result = await service.createFacture(factureData, 6);

  expect(transactionMock.factureSequence.upsert).toHaveBeenCalledWith({
    where: {
      entrepriseId_annee: {
        entrepriseId: 6,
        annee: new Date().getFullYear(),
      },
    },
    create: {
      entrepriseId: 6,
      annee: new Date().getFullYear(),
      dernierNumero: 1,
    },
    update: {
      dernierNumero: {
        increment: 1,
      },
    },
  });

  expect(transactionMock.facture.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        numero: createdFacture.numero,
        entrepriseId: 6,
        montantHT: 200000,
        montantTTC: 236000,
      }),
      include: { items: true },
    }),
  );

  expect(result.facture).toEqual(createdFacture);
});

it('propage une erreur si la création des lignes échoue pendant la modification', async () => {
  transactionMock.facture.updateMany.mockResolvedValue({ count: 1 });
  transactionMock.factureItem.deleteMany.mockResolvedValue({ count: 1 });
  transactionMock.factureItem.createMany.mockRejectedValue(
    new Error('Erreur lors de la création des lignes'),
  );

  await expect(
    service.updateFacture(20, factureData, 6),
  ).rejects.toThrow('Erreur lors de la création des lignes');

  expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
});
});
