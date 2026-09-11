import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';


export class UpdateClientDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  telephone!: string;

  @IsString()
  @IsNotEmpty()
  adresse!: string;

  @IsIn(['Actif', 'Inactif'])
  statut!: 'Actif' | 'Inactif';
}