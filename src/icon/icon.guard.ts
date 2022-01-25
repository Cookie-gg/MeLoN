import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IconGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (
      context.getArgs()[0].rawHeaders[context.getArgs()[0].rawHeaders.indexOf('key') + 1] ===
      process.env.ICON_SECRET_KEY
    ) {
      return true;
    } else return false;
  }
}
