import type { Context } from "moleculer";
import { Errors } from "moleculer";


interface Employee {
  authToken: string;
}

interface ServiceGuardMiddlewareContext extends Context {
  meta: {
    user: Employee;
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const { MoleculerClientError } = Errors;

const localAction = (next: Function, action: any) => {
  if (action.restricted) {
    return async function serviceGuardMiddleware(ctx: ServiceGuardMiddlewareContext) {
      if (!ctx.meta.user)
        {throw new MoleculerClientError(
          "Service token is missing,Please login",
          401,
          "TOKEN_MISSING"
        );}
      const token = ctx.meta.user.authToken;
      if (!token)
        {throw new MoleculerClientError(
          "Service token is missing",
          401,
          "TOKEN_MISSING"
        );}

      await ctx.call("guard.check", { token, services: action.restricted });

      return next(ctx);
    };
  }

  return next;
};


export default {
  localAction,
};