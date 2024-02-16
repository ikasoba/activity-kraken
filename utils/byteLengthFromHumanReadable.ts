export const byteLengthFromHumanReadable = (readable: string) => {
  const rawDuration = readable.match(/^([0-9]+(?:\.[0-9]+)?)/)?.[1];
  if (!rawDuration) return 0;

  const duration = parseFloat(rawDuration);

  const suffix = readable.slice(rawDuration.length).toLowerCase();

  switch (suffix) {
    case "k":
    case "kb":
      return duration * 1024;

    case "m":
    case "mb":
      return duration * 1024 * 1024;

    case "g":
    case "gb":
      return duration * 1024 * 1024 * 1024;

    case "b":
    default:
      return duration;
  }
};
