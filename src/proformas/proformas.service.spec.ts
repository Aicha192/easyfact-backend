
jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProformasService } from './proformas.service';

describe('ProformasService - isolation des entreprises', () => {
  let service: ProformasService;

  const txMock = {
    proforma: {
      updateMany: jest.fn(),
      findFirst: jest.fn(),
    },
    proformaItem: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  };

  const prismaMock = {
    $transaction: jest.fn(),
    proforma: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    prismaMock.$transaction.mockImplementation(
      async (callback) => callback(txMock),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProformasService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProformasService>(ProformasService);
  });

  it('modifie uniquement une proforma appartenant à l’entreprise connectée', async () => {
    txMock.proforma.updateMany.mockResolvedValue({ count: 1 });

    txMock.proforma.findFirst.mockResolvedValue({
      id: 1,
      entrepriseId: 10,
      numero: 'PRO-001',
      items: [],
    });

    txMock.proformaItem.deleteMany.mockResolvedValue({ count: 0 });
    txMock.proformaItem.createMany.mockResolvedValue({ count: 1 });

    const result = await service.updateProforma(
      1,
      {
        numero: 'PRO-001',
        client: 'Client test',
        items: [
          {
            designation: 'Ordinateur',
            quantite: 1,
            prixUnitaire: 100000,
          },
        ],
        dateEmission: '2026-11-21',
        dateValidite: '2026-12-21',
        tva: 18,
        statut: 'Brouillon',
      },
      10,
    );

    expect(txMock.proforma.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 1,
          entrepriseId: 10,
        },
      }),
    );

    expect(txMock.proformaItem.deleteMany).toHaveBeenCalled();
    expect(txMock.proformaItem.createMany).toHaveBeenCalled();

    expect(result.proforma).toBeDefined();
  });

  it('refuse de modifier une proforma qui ne correspond pas à l’entreprise', async () => {
    txMock.proforma.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.updateProforma(
        1,
        {
          numero: 'PRO-001',
          client: 'Client test',
          items: [],
          dateEmission: '2026-11-21',
          dateValidite: '2026-12-21',
          tva: 18,
          statut: 'Brouillon',
        },
        20,
      ),
    ).rejects.toThrow(NotFoundException);

    expect(txMock.proforma.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 1,
          entrepriseId: 20,
        },
      }),
    );

    expect(txMock.proformaItem.deleteMany).not.toHaveBeenCalled();
    expect(txMock.proformaItem.createMany).not.toHaveBeenCalled();
  });

  it('supprime uniquement une proforma appartenant à l’entreprise connectée', async () => {
    prismaMock.proforma.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.deleteProforma(1, 10);

    expect(prismaMock.proforma.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        entrepriseId: 10,
      },
    });

    expect(result).toEqual({
      message: 'Proforma supprimée avec succès',
      proformaId: 1,
    });
  });

  it('refuse de supprimer une proforma qui ne correspond pas à l’entreprise', async () => {
    prismaMock.proforma.deleteMany.mockResolvedValue({ count: 0 });

    await expect(
      service.deleteProforma(1, 20),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.proforma.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        entrepriseId: 20,
      },
    });
  });
});
