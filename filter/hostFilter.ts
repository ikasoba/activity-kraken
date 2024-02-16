export interface HostFilterOptions {
  whiteList: string[];
}

export function createHostFilter(opts: HostFilterOptions) {
  return (host: string) => {
    if (!opts.whiteList.some((x) => x == "*" || host == x)) return false;

    return true;
  };
}
