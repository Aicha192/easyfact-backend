import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
  private readonly jwtService: JwtService,
  private readonly prisma: PrismaService,
  private readonly mailService: MailService,
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
  async forgotPassword(email: string) {
  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  // Réponse volontairement générique pour éviter
  // de révéler si l'adresse e-mail existe.
  if (!user) {
    return;
  }

  const rawToken = randomBytes(32).toString('hex');

  const hashedToken = createHash('sha256')
    .update(rawToken)
    .digest('hex');

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiresAt,
    },
  });

  const frontendUrl = 'https://easyfact-chi.vercel.app';

  const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

  await this.mailService.sendPasswordResetEmail(
    user.email,
    resetLink,
  );
}

async resetPassword(token: string, password: string) {
  const hashedToken = createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await this.prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return true;
}
}