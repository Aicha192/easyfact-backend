
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL est manquant dans le fichier .env');
    }

    const url = new URL(databaseUrl);
    const caPath = path.resolve(process.cwd(), 'ca.pem');

    if (!fs.existsSync(caPath)) {
      throw new Error(`Certificat SSL introuvable : ${caPath}`);
    }

    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      connectionLimit: 5,
      connectTimeout: 10000,
      acquireTimeout: 15000,
      initializationTimeout: 14000,
      ssl: {
        ca: fs.readFileSync(caPath, 'utf8'),
        rejectUnauthorized: true,
      },
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
