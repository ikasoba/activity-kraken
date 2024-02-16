export const secretHeaders = new Set(["authorization", "cookie", "x-api-key"]);

export const filterSecretHeader = (obj: Record<string, string>) => {
  const res: Record<string, string> = {};

  for (const key in obj) {
    if (secretHeaders.has(key)) continue;

    res[key] = obj[key];
  }

  return res;
};
