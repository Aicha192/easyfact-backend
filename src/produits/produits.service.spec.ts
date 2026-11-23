
jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProduitsService } from './produits.service';

describe('ProduitsService - isolation des entreprises', () => {
  let service: ProduitsService;

  const prismaMock = {
    produit: {
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const produitData = {
    reference: 'PROD-001',
    nom: 'Ordinateur',
    categorie: 'Produit' as const,
    prix: 250000,
    unite: 'Pièce',
    statut: 'Actif' as const,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProduitsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProduitsService>(ProduitsService);
  });

  it('récupère uniquement les produits de l’entreprise connectée', async () => {
    prismaMock.produit.findMany.mockResolvedValue([]);

    await service.getProduits(6);

    expect(prismaMock.produit.findMany).toHaveBeenCalledWith({
      where: { entrepriseId: 6 },
      orderBy: { id: 'asc' },
    });
  });

  it('associe le nouveau produit à l’entreprise connectée', async () => {
    prismaMock.produit.create.mockResolvedValue({
      id: 10,
      ...produitData,
      entrepriseId: 6,
    });

    const result = await service.createProduit(produitData, 6);

    expect(prismaMock.produit.create).toHaveBeenCalledWith({
      data: {
        ...produitData,
        entrepriseId: 6,
      },
    });

    expect(result.produit.entrepriseId).toBe(6);
  });

  it('refuse de modifier un produit qui ne correspond pas à l’entreprise connectée', async () => {
    prismaMock.produit.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.updateProduit(20, produitData, 6),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.produit.updateMany).toHaveBeenCalledWith({
      where: {
        id: 20,
        entrepriseId: 6,
      },
      data: produitData,
    });

    expect(prismaMock.produit.findFirst).not.toHaveBeenCalled();
  });

  it('modifie un produit appartenant à l’entreprise connectée', async () => {
    const updatedProduit = {
      id: 20,
      ...produitData,
      entrepriseId: 6,
    };

    prismaMock.produit.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.produit.findFirst.mockResolvedValue(updatedProduit);

    const result = await service.updateProduit(20, produitData, 6);

    expect(prismaMock.produit.findFirst).toHaveBeenCalledWith({
      where: {
        id: 20,
        entrepriseId: 6,
      },
    });

    expect(result.produit).toEqual(updatedProduit);
  });

  it('refuse de supprimer un produit qui ne correspond pas à l’entreprise connectée', async () => {
    prismaMock.produit.deleteMany.mockResolvedValue({ count: 0 });

    await expect(
      service.deleteProduit(20, 6),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.produit.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 20,
        entrepriseId: 6,
      },
    });
  });

  it('supprime un produit appartenant à l’entreprise connectée', async () => {
    prismaMock.produit.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.deleteProduit(20, 6);

    expect(result).toEqual({
      message: 'Produit supprimé avec succès',
      produitId: 20,
    });
  });
});
