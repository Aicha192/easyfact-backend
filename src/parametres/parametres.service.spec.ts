
jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ParametresService } from './parametres.service';

describe('ParametresService - isolation des entreprises', () => {
  let service: ParametresService;

  const prismaMock = {
    parametres: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };

  const parametresData = {
    nomEntreprise: 'EasyFact',
    responsable: 'Responsable Test',
    adresse: 'Dakar',
    telephone: '770000000',
    email: 'contact@easyfact.com',
    siteWeb: 'https://easyfact.com',
    ninea: '123456789',
    rccm: 'SN-DKR-2026-B-12345',
    devise: 'FCFA',
    conditionsPaiement: 'Paiement sous 30 jours',
    logo: '',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParametresService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ParametresService>(ParametresService);
  });

  it('récupère uniquement les paramètres de l’entreprise connectée', async () => {
    prismaMock.parametres.findFirst.mockResolvedValue({
      id: 1,
      ...parametresData,
      entrepriseId: 6,
    });

    await service.getParametres(6);

    expect(prismaMock.parametres.findFirst).toHaveBeenCalledWith({
      where: { entrepriseId: 6 },
      orderBy: { id: 'asc' },
    });
  });

  it('met à jour les paramètres existants de l’entreprise connectée', async () => {
    prismaMock.parametres.findFirst.mockResolvedValue({
      id: 1,
      entrepriseId: 6,
    });

    prismaMock.parametres.update.mockResolvedValue({
      id: 1,
      ...parametresData,
      entrepriseId: 6,
    });

    const result = await service.updateParametres(parametresData, 6);

    expect(prismaMock.parametres.update).toHaveBeenCalledWith({
      where: { entrepriseId: 6 },
      data: parametresData,
    });

    expect(prismaMock.parametres.create).not.toHaveBeenCalled();

    expect(result.parametres.entrepriseId).toBe(6);
  });

  it('crée les paramètres en les associant à l’entreprise connectée lorsqu’ils sont absents', async () => {
    prismaMock.parametres.findFirst.mockResolvedValue(null);

    prismaMock.parametres.create.mockResolvedValue({
      id: 2,
      ...parametresData,
      entrepriseId: 6,
    });

    const result = await service.updateParametres(parametresData, 6);

    expect(prismaMock.parametres.create).toHaveBeenCalledWith({
      data: {
        ...parametresData,
        entreprise: {
          connect: {
            id: 6,
          },
        },
      },
    });

    expect(prismaMock.parametres.update).not.toHaveBeenCalled();

    expect(result.parametres.entrepriseId).toBe(6);
  });
});
