import {
  Body,
  Controller,
  Delete,
  Get,
  UseGuards,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';


@UseGuards(JwtGuard)
@Controller('produits')
export class ProduitsController {
  constructor(private readonly produitsService: ProduitsService) {}

  @Get()
getProduits(@Req() request: any) {
  return this.produitsService.getProduits(
    request.user.entrepriseId,
  );
}

@Post()
createProduit(
  @Req() request: any,
  @Body()
  produit: {
    reference: string;
    nom: string;
    categorie: 'Produit' | 'Service';
    prix: number;
    unite: string;
    statut: 'Actif' | 'Inactif';
  },
) {
  return this.produitsService.createProduit(
    produit,
    request.user.entrepriseId,
  );
}

@Put(':id')
updateProduit(
  @Req() request: any,
  @Param('id') id: string,
  @Body()
  produit: {
    reference: string;
    nom: string;
    categorie: 'Produit' | 'Service';
    prix: number;
    unite: string;
    statut: 'Actif' | 'Inactif';
  },
) {
  return this.produitsService.updateProduit(
    Number(id),
    produit,
    request.user.entrepriseId,
  );
}

@Delete(':id')
deleteProduit(
  @Req() request: any,
  @Param('id') id: string,
) {
  return this.produitsService.deleteProduit(
    Number(id),
    request.user.entrepriseId,
  );
}
}