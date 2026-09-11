import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProduitDto {
  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsIn(['Produit', 'Service'])
  categorie!: 'Produit' | 'Service';

  @IsNumber()
  @Min(0)
  prix!: number;

  @IsString()
  @IsNotEmpty()
  unite!: string;

  @IsIn(['Actif', 'Inactif'])
  statut!: 'Actif' | 'Inactif';
}