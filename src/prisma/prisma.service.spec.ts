
jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: class PrismaClient {
    $connect = jest.fn();
    $disconnect = jest.fn();

    constructor(public options: any) {}
  },
}));

jest.mock('@prisma/adapter-mariadb', () => ({
  PrismaMariaDb: class PrismaMariaDb {
    constructor(public config: any) {}
  },
}));

jest.mock('node:fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  readFileSync: jest.fn().mockReturnValue('certificat-test'),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    process.env.DATABASE_URL =
      'mysql://test_user:test_password@localhost:3306/test_database';

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
