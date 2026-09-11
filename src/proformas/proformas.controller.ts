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
import { CreateProformaDto } from './dto/create-proforma.dto';
import { UpdateProformaDto } from './dto/update-proforma.dto';

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
 @Body() proforma: CreateProformaDto
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
  @Body() proforma: UpdateProformaDto
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