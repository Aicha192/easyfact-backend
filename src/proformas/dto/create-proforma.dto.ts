import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProformaItemDto {
  @IsString()
  @IsNotEmpty()
  designation!: string;

  @IsNumber()
  @Min(0)
  quantite!: number;

  @IsNumber()
  @Min(0)
  prixUnitaire!: number;

  @IsNumber()
  @Min(0)
  total!: number;
}

export class CreateProformaDto {
  @IsString()
  @IsNotEmpty()
  numero!: string;

  @IsString()
  @IsNotEmpty()
  client!: string;

  @IsDateString()
  dateEmission!: string;

  @IsDateString()
  dateValidite!: string;

  @IsNumber()
  @Min(0)
  montantHT!: number;

  @IsNumber()
  @Min(0)
  tva!: number;

  @IsNumber()
  @Min(0)
  montantTTC!: number;

  @IsIn([
  'Brouillon',
  'Envoyée',
  'Acceptée',
  'Refusée',
  'Expirée',
])
statut!:
  | 'Brouillon'
  | 'Envoyée'
  | 'Acceptée'
  | 'Refusée'
  | 'Expirée';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  factureNumero?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProformaItemDto)
  items!: CreateProformaItemDto[];
}