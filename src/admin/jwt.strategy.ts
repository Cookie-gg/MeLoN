import { JWT_SECRET_KEY } from './secrets';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  validate(payload: { isAdmin: boolean; refresh_token: string }) {
    if (payload.isAdmin === true) {
      return true;
    } else {
      return false;
    }
  }
}
