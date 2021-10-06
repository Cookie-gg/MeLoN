import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

const AppMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  if (process.env.PORT) {
    ctx.context.req.headers.authorization === process.env.GRAPHQL_SECRET_KEY &&
      (await next());
  } else await next();
};

export default AppMiddleware;
