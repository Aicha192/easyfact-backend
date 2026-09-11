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
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';


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
  @Body() produit: CreateProduitDto,
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
  @Body() produit: UpdateProduitDto,
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