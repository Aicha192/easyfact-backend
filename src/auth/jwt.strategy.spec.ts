
jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    strategy = new JwtStrategy(
      mockConfigService as unknown as ConfigService,
      mockPrisma as unknown as PrismaService,
    );
  });

  it('doit retourner les informations utilisateur depuis la base de données', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 6,
      email: 'utilisateur@example.com',
      role: 'ADMIN',
      entrepriseId: 6,
    });

    const result = await strategy.validate({
      sub: 6,
      email: 'ancien@example.com',
    });

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 6 },
      select: {
        id: true,
        email: true,
        role: true,
        entrepriseId: true,
      },
    });

    expect(result).toEqual({
      userId: 6,
      email: 'utilisateur@example.com',
      role: 'ADMIN',
      entrepriseId: 6,
    });
  });

  it('doit refuser un utilisateur inexistant', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      strategy.validate({
        sub: 999,
        email: 'inexistant@example.com',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('doit refuser un utilisateur sans entreprise associée', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 6,
      email: 'utilisateur@example.com',
      role: 'ADMIN',
      entrepriseId: null,
    });

    await expect(
      strategy.validate({
        sub: 6,
        email: 'utilisateur@example.com',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
