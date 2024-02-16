FROM denoland/deno:1.40.4

WORKDIR /app

RUN touch .env

COPY [".env-example", "deno.json", "./"]
COPY filter/ filter/
COPY proxy/ proxy/
COPY utils/ utils/
COPY main.ts .

RUN deno cache main.ts

CMD deno run -A --unstable ./main.ts