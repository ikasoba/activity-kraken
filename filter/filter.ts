import { Context } from "hono/mod.ts";
import { $AcCreate, $AcObjectable } from "../utils/ap-validator.ts";
import { createContentFilter } from "./contentFilter.ts";
import { createHostFilter } from "./hostFilter.ts";
import { ProxyEnv } from "../proxy/proxy.ts";

export function createMainFilter(opts: {
  host: string;
  maxContentSize: number;
  isSafeContent: ReturnType<typeof createContentFilter>;
  isSafeHost: ReturnType<typeof createHostFilter>;
}) {
  return async (ctx: Context<ProxyEnv>): Promise<boolean> => {
    const rawContentLength = ctx.req.header("Content-Length");
    const contentLength = rawContentLength ? parseInt(rawContentLength) : null;
    const contentType = ctx.req.header("Content-Type")?.toLowerCase();

    if (contentLength != null && contentLength >= opts.maxContentSize) {
      return false;
    }

    switch (contentType) {
      case "application/activity+json": {
        const obj: unknown = await ctx.req.raw
          .clone()
          .json()
          .catch(() => undefined);

        if (!$AcObjectable(obj)) return false;

        const identifiable = obj.actor ?? obj.id;
        if (
          identifiable == null ||
          !opts.isSafeHost(new URL(identifiable).host)
        ) {
          return false;
        }

        if ($AcCreate(obj)) {
          if (obj.object.content == null) {
            return false;
          }

          if (!opts.isSafeContent(obj.object.content)) {
            return false;
          }
        }

        return true;
      }

      default: {
        return true;
      }
    }
  };
}
