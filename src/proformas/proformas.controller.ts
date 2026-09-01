import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProformasService } from './proformas.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('proformas')
export class ProformasController {
  constructor(private readonly proformasService: ProformasService) {}

  @Get()
getProformas(@Req() request: any) {
  return this.proformasService.getProformas(
    request.user.entrepriseId,
  );
}

  @Post()
  createProforma(
  @Req() request: any,
  @Body() proforma: any,
) {
  return this.proformasService.createProforma(
    proforma,
    request.user.entrepriseId,
  );
}

  @Put(':id')
updateProforma(
  @Req() request: any,
  @Param('id') id: string,
  @Body() proforma: any,
) {
  return this.proformasService.updateProforma(
    Number(id),
    proforma,
    request.user.entrepriseId,
  );
}

 @Delete(':id')
deleteProforma(
  @Req() request: any,
  @Param('id') id: string,
) {
  return this.proformasService.deleteProforma(
    Number(id),
    request.user.entrepriseId,
  );
}
}