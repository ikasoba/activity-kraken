export function fetchForProxy(...params: Parameters<typeof fetch>) {
  const client = Deno.createHttpClient({ allowHost: true });

  params[1] = Object.assign(params[1] ?? {}, {
    client,
  });

  return fetch(...params).finally(() => client.close());
}
