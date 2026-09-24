import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
async login(@Body() data: LoginDto) {
    const user = await this.authService.login(
  data.email,
  data.password,
);

    if (!user) {
  throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return {
  message: 'Connexion réussie',
  access_token: user.access_token,
  user: user.user,
};
  }

  @Post('register')
async register(@Body() data: RegisterDto) {
  const user = await this.authService.register(
    data.nom,
    data.email,
    data.telephone ?? '',
    data.password,
  );

  if (!user) {
  throw new ConflictException('Cette adresse e-mail est déjà utilisée');
  }

  return {
    message: 'Compte créé avec succès',
    user,
  };
}
@Post('forgot-password')
async forgotPassword(@Body() data: ForgotPasswordDto) {
  await this.authService.forgotPassword(data.email);

  return {
    message:
      'Si cette adresse e-mail existe, un lien de réinitialisation a été envoyé.',
  };
}
@Post('reset-password')
async resetPassword(@Body() data: ResetPasswordDto) {
  const success = await this.authService.resetPassword(
    data.token,
    data.password,
  );

  if (!success) {
  throw new BadRequestException(
    'Le lien de réinitialisation est invalide ou expiré.',
  );
  }

  return {
    message: 'Mot de passe réinitialisé avec succès.',
  };
}
}