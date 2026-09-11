import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret!,
    });
  }

  validate(payload: {
    sub: number;
    email: string;
    role: string;
    entrepriseId: number;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      entrepriseId: payload.entrepriseId,
    };
  }
}