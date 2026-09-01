import {
  Body,
  Controller,
  Get,
  UseGuards,
  Delete,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { FacturesService } from './factures.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('factures')
export class FacturesController {
  constructor(private readonly facturesService: FacturesService) {}

  @Get()
getFactures(@Req() request: any) {
  return this.facturesService.getFactures(
    request.user.entrepriseId,
  );
}

@Post()
createFacture(
  @Req() request: any,
  @Body() facture: any,
) {
  return this.facturesService.createFacture(
    facture,
    request.user.entrepriseId,
  );
}

@Put(':id')
updateFacture(
  @Req() request: any,
  @Param('id') id: string,
  @Body() facture: any,
) {
  return this.facturesService.updateFacture(
    Number(id),
    facture,
    request.user.entrepriseId,
  );
}

@Delete(':id')
deleteFacture(
  @Req() request: any,
  @Param('id') id: string,
) {
  return this.facturesService.deleteFacture(
    Number(id),
    request.user.entrepriseId,
  );
}
}