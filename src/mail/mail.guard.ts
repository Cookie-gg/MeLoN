import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MailGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (
      context.getArgs()[0].raw.rawHeaders[context.getArgs()[0].raw.rawHeaders.indexOf('key') + 1] ===
      process.env.MAIL_SECRET_KEY
    ) {
      return true;
    } else return false;
  }
}
