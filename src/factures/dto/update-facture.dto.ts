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

export class UpdateFactureItemDto {
  @IsNumber()
  id!: number;

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

export class UpdateFactureDto {
  @IsString()
  @IsNotEmpty()
  client!: string;

  @IsDateString()
  dateEmission!: string;

  @IsDateString()
  dateEcheance!: string;

  @IsNumber()
  @Min(0)
  montantHT!: number;

  @IsNumber()
  @Min(0)
  tva!: number;

  @IsNumber()
  @Min(0)
  montantTTC!: number;

  @IsIn(['Brouillon', 'Envoyée', 'Payée', 'En retard'])
  statut!: 'Brouillon' | 'Envoyée' | 'Payée' | 'En retard';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFactureItemDto)
  items!: UpdateFactureItemDto[];
}