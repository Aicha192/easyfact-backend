import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParametresService {
  constructor(private readonly prisma: PrismaService) {}

  async getParametres(entrepriseId: number) {
  return this.prisma.parametres.findFirst({
    where: {
      entrepriseId,
    },
    orderBy: {
      id: 'asc',
    },
  });
}

 async updateParametres(
  parametres: {
    nomEntreprise: string;
    responsable: string;
    adresse: string;
    telephone: string;
    email: string;
    siteWeb: string;
    ninea: string;
    rccm: string;
    devise: string;
    conditionsPaiement: string;
    logo: string;
  },
  entrepriseId: number,
) {
  const existingParametres = await this.prisma.parametres.findFirst({
    where: {
      entrepriseId,
    },
  });

  let savedParametres;

  if (existingParametres) {
    savedParametres = await this.prisma.parametres.update({
      where: {
        id: existingParametres.id,
      },
      data: {
        nomEntreprise: parametres.nomEntreprise,
        responsable: parametres.responsable,
        adresse: parametres.adresse,
        telephone: parametres.telephone,
        email: parametres.email,
        siteWeb: parametres.siteWeb,
        ninea: parametres.ninea,
        rccm: parametres.rccm,
        devise: parametres.devise,
        conditionsPaiement: parametres.conditionsPaiement,
        logo: parametres.logo,
      },
    });
  } else {
    savedParametres = await this.prisma.parametres.create({
      data: {
        nomEntreprise: parametres.nomEntreprise,
        responsable: parametres.responsable,
        adresse: parametres.adresse,
        telephone: parametres.telephone,
        email: parametres.email,
        siteWeb: parametres.siteWeb,
        ninea: parametres.ninea,
        rccm: parametres.rccm,
        devise: parametres.devise,
        conditionsPaiement: parametres.conditionsPaiement,
        logo: parametres.logo,
        entreprise: {
          connect: {
            id: entrepriseId,
          },
        },
      },
    });
  }

  return {
    message: 'Paramètres enregistrés avec succès',
    parametres: savedParametres,
  };
 }
}