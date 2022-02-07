import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MarkdownGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context.getArgs()[0].raw.rawHeaders);
    if (
      context.getArgs()[0].raw.rawHeaders[context.getArgs()[0].raw.rawHeaders.indexOf('key') + 1] ===
      process.env.MARKDOWN_SECRET_KEY
    ) {
      return true;
    } else return false;
  }
}
