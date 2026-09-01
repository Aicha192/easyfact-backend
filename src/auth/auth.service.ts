import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordCorrect) {
      return null;
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      entrepriseId: user.entrepriseId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        avatar: user.avatar,
        entrepriseId: user.entrepriseId,
      },
    };
  }

  async register(
    nom: string,
    email: string,
    telephone: string,
    password: string,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const entreprise = await tx.entreprise.create({
        data: {
          nom: nom,
          email: email,
          telephone: telephone,
          adresse: '',
        },
      });

      const user = await tx.user.create({
        data: {
          nom,
          email,
          telephone,
          password: hashedPassword,
          role: 'Administrateur',
          entrepriseId: entreprise.id,
        },
      });

      return {
        entreprise,
        user,
      };
    });

    return {
      id: result.user.id,
      nom: result.user.nom,
      email: result.user.email,
      telephone: result.user.telephone,
      role: result.user.role,
      avatar: result.user.avatar,
      entrepriseId: result.user.entrepriseId,
    };
  }
}