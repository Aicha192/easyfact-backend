
import { validate } from 'class-validator';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { CreateClientDto } from './create-client.dto';

describe('CreateClientDto', () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  it('accepte les données valides d’un client', async () => {
    const dto = Object.assign(new CreateClientDto(), {
      nom: 'Nouveau Client',
      email: 'nouveau.client@example.com',
      telephone: '770000003',
      adresse: 'Dakar',
      statut: 'Actif',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejette une propriété entrepriseId non autorisée', async () => {
    const payload = {
      nom: 'Nouveau Client',
      email: 'nouveau.client@example.com',
      telephone: '770000003',
      adresse: 'Dakar',
      statut: 'Actif',
      entrepriseId: 999,
    };

    await expect(
      validationPipe.transform(payload, {
        type: 'body',
        metatype: CreateClientDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
