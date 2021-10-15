import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MarkdownGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (
      context.getArgs()[0].rawHeaders[
        context.getArgs()[0].rawHeaders.indexOf('authorization') + 1
      ] === process.env.MARKDOWN_SECRET_KEY
    ) {
      return true;
    } else return false;
  }
}
