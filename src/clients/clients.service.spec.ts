
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

// Simuler Prisma avant le chargement du service
jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientsService - isolation des entreprises', () => {
  let service: ClientsService;

  const prismaMock = {
    client: {
       create: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('refuse de modifier un client qui ne correspond pas à l’entreprise connectée', async () => {
    prismaMock.client.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.updateClient(
        20,
        {
          nom: 'Client Test Entreprise B',
          email: 'client.test.b@example.com',
          telephone: '770000002',
          adresse: 'Dakar',
          statut: 'Actif',
        },
        6,
      ),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.client.updateMany).toHaveBeenCalledWith({
      where: {
        id: 20,
        entrepriseId: 6,
      },
      data: {
        nom: 'Client Test Entreprise B',
        email: 'client.test.b@example.com',
        telephone: '770000002',
        adresse: 'Dakar',
        statut: 'Actif',
      },
    });

    expect(prismaMock.client.findFirst).not.toHaveBeenCalled();
  });

  it('refuse de supprimer un client qui ne correspond pas à l’entreprise connectée', async () => {
    prismaMock.client.deleteMany.mockResolvedValue({ count: 0 });

    await expect(
      service.deleteClient(20, 6),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.client.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 20,
        entrepriseId: 6,
      },
    });
  });

  it('associe le nouveau client à l’entreprise connectée', async () => {
  const clientData = {
    nom: 'Nouveau Client',
    email: 'nouveau.client@example.com',
    telephone: '770000003',
    adresse: 'Dakar',
    statut: 'Actif' as const,
  };

  prismaMock.client.create.mockResolvedValue({
    id: 21,
    ...clientData,
    entrepriseId: 6,
  });

  await service.createClient(clientData, 6);

  expect(prismaMock.client.create).toHaveBeenCalledWith({
    data: {
      ...clientData,
      entrepriseId: 6,
    },
  });
 });
  it('modifie un client appartenant à l’entreprise connectée', async () => {
    const clientData = {
      nom: 'Client Modifié',
      email: 'client.modifie@example.com',
      telephone: '770000004',
      adresse: 'Dakar',
      statut: 'Actif' as const,
    };

    prismaMock.client.updateMany.mockResolvedValue({ count: 1 });

    prismaMock.client.findFirst.mockResolvedValue({
      id: 20,
      ...clientData,
      entrepriseId: 6,
    });

    const result = await service.updateClient(20, clientData, 6);

    expect(prismaMock.client.updateMany).toHaveBeenCalledWith({
      where: { id: 20, entrepriseId: 6 },
      data: clientData,
    });

    expect(result.client).toEqual({
      id: 20,
      ...clientData,
      entrepriseId: 6,
    });
  });

  it('supprime un client appartenant à l’entreprise connectée', async () => {
    prismaMock.client.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.deleteClient(20, 6);

    expect(prismaMock.client.deleteMany).toHaveBeenCalledWith({
      where: { id: 20, entrepriseId: 6 },
    });

    expect(result).toEqual({
      message: 'Client supprimé avec succès',
      clientId: 20,
    });
  });
});
