const output = prompt("output file:", "host-filter.txt");

if (output == null) {
  console.error("Output destination is required.");
  Deno.exit(1);
}

const url = prompt("instance url:")?.replace(/^(?!https?)/, "http://");

if (url == null || !URL.canParse(url)) {
  console.error("URL to the instance is required.");
  Deno.exit(1);
}

const onlyFederating = prompt("only federating:", "false");

const instances = await fetch(new URL("/api/federation/instances", url), {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    federating: onlyFederating != null && /y(es)?|true/i.test(onlyFederating),
  }),
})
  .then((x) => x.json())
  .then((x) => x.map((o: Record<string, string>) => o.host));

Deno.writeTextFile(output, instances.join("\n"));
