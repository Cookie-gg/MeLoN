import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  validate(username: string, password: string): boolean {
    if (username === process.env.ADMIN_NAME && password == process.env.ADMIN_PASSWORD) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
