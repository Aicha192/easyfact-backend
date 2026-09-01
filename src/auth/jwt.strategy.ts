import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    console.log('========== JWT STRATEGY ==========');
    console.log('JWT_SECRET présent ?', !!secret);
    console.log('==================================');

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
  console.log('JWT VALIDÉ :', {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    entrepriseId: payload.entrepriseId,
  });

  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
    entrepriseId: payload.entrepriseId,
  };
}
}