import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
      return {
        message: 'Email ou mot de passe incorrect',
      };
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
    return {
      message: 'Cette adresse e-mail est déjà utilisée',
    };
  }

  return {
    message: 'Compte créé avec succès',
    user,
  };
}
}