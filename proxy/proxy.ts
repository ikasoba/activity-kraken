import { MiddlewareHandler } from "hono/mod.ts";
import { startProxy } from "../utils/proxy.ts";
import { createMainFilter } from "../filter/filter.ts";
import { filterSecretHeader } from "../utils/filterSecretHeader.ts";

export interface ProxyEnv {
  Bindings: {
    remoteAddr: Deno.NetAddr;
  };
}

export function createMainProxy(opts: {
  host: string;
  isOk: ReturnType<typeof createMainFilter>;
}): MiddlewareHandler {
  return async (ctx) => {
    const url = new URL(ctx.req.raw.url);

    if (!(await opts.isOk(ctx))) {
      console.info(
        "[blocked]",
        ctx.req.method,
        ctx.req.path,
        "-",
        filterSecretHeader(Object.fromEntries(ctx.req.raw.headers))
      );
      return ctx.text("", 403);
    }

    console.info(
      "[accepted]",
      ctx.req.method,
      ctx.req.path,
      "-",
      filterSecretHeader(Object.fromEntries(ctx.req.raw.headers))
    );

    return await startProxy(
      new URL(url.pathname + url.search, opts.host),
      ctx.req.raw
    );
  };
}
