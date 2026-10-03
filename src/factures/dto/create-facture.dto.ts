import {
  IsArray,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFactureItemDto {
  @IsString()
  @IsNotEmpty()
  designation!: string;

  @IsNumber()
  @Min(0)
  quantite!: number;

  @IsNumber()
  @Min(0)
  prixUnitaire!: number;
}

export class CreateFactureDto {
  @IsString()
  @IsNotEmpty()
  client!: string;

  @IsDateString()
  dateEmission!: string;

  @IsDateString()
  dateEcheance!: string;

  @IsNumber()
  @Min(0)
  tva!: number;

  @IsIn(['Brouillon', 'Envoyée', 'Payée', 'En retard'])
  statut!: 'Brouillon' | 'Envoyée' | 'Payée' | 'En retard';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFactureItemDto)
  items!: CreateFactureItemDto[];
}