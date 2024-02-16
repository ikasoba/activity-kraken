import { load } from "dotenv/mod.ts";
import { createMainProxy, ProxyEnv } from "./proxy/proxy.ts";
import { byteLengthFromHumanReadable } from "./utils/byteLengthFromHumanReadable.ts";
import { createContentFilter } from "./filter/contentFilter.ts";
import { Hono } from "hono/mod.ts";
import { createHostFilter } from "./filter/hostFilter.ts";
import { createMainFilter } from "./filter/filter.ts";

const env = await load({
  envPath: ".env",
  examplePath: ".env-example",
  export: true,
  defaultsPath: ".env-example",
});

const maxContentSize = byteLengthFromHumanReadable(env.MAX_CONTENT_SIZE);

const app = new Hono<ProxyEnv>();

const proxy = createMainProxy({
  host: env.PROXY_HOST,
  isOk: createMainFilter({
    host: env.PROXY_HOST,
    maxContentSize: maxContentSize,
    isSafeHost: createHostFilter({
      whiteList: await Deno.readTextFile(env.HOST_FILTER_FILE).then((x) =>
        x.split(/\s+/)
      ),
    }),
    isSafeContent: createContentFilter({
      filters: await Deno.readTextFile(env.CONTENT_FILTER_FILE).then((x) =>
        x.split(/[\r\n]+/).map((x) => new RegExp(x, "u"))
      ),
      maxContentSize: maxContentSize,
      maxMentions: parseInt(env.MAX_MENTIONS),
    }),
  }),
});

app.use("*", proxy);

Deno.serve(
  {
    port: parseInt(env.PORT),
  },
  (req, info) => {
    return app.fetch(req, info);
  }
);
