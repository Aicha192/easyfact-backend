import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async updateUser(
    id: number,
    data: {
      nom: string;
      telephone: string;
      avatar?: string | null;
      ancienPassword?: string;
      nouveauPassword?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    let password: string | undefined;

    // Changement du mot de passe
    if (data.ancienPassword || data.nouveauPassword) {
      if (!data.ancienPassword || !data.nouveauPassword) {
        throw new BadRequestException(
          'Ancien et nouveau mot de passe requis',
        );
      }

      const passwordCorrect = await bcrypt.compare(
        data.ancienPassword,
        user.password,
      );

      if (!passwordCorrect) {
        throw new BadRequestException(
          'Ancien mot de passe incorrect',
        );
      }

      if (data.nouveauPassword.length < 6) {
        throw new BadRequestException(
          'Le nouveau mot de passe doit contenir au moins 6 caractères',
        );
      }

      password = await bcrypt.hash(data.nouveauPassword, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        nom: data.nom,
        telephone: data.telephone,
        avatar: data.avatar,
        ...(password ? { password } : {}),
      },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
        avatar: true,
      },
    });

    return {
      message: 'Profil modifié avec succès',
      user: updatedUser,
    };
  }
}