import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MailGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (
      context.getArgs()[0].rawHeaders[context.getArgs()[0].rawHeaders.indexOf('authorization') + 1] ===
      process.env.MAIL_SECRET_KEY
    ) {
      return true;
    } else return false;
  }
}
