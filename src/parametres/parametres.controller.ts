import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParametresService } from './parametres.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('parametres')
export class ParametresController {
  constructor(
    private readonly parametresService: ParametresService,
  ) {}

  @Get()
getParametres(@Req() request: any) {
  return this.parametresService.getParametres(
    request.user.entrepriseId,
  );
}

  @Put()
updateParametres(
  @Req() request: any,
  @Body()
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
) {
  return this.parametresService.updateParametres(
    parametres,
    request.user.entrepriseId,
  );
}
}