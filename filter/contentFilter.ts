import { load } from "cheerio";

export interface ContentFilterOptions {
  maxContentSize: number;
  maxMentions: number;
  filters: RegExp[];
}

export function createContentFilter(opts: ContentFilterOptions) {
  return (content: string) => {
    if (content.length >= opts.maxContentSize) return false;
    if (opts.filters.some((x) => content.match(x))) return false;

    const $ = load(content);

    if ($("a.mention").length > opts.maxMentions) {
      return false;
    }

    return true;
  };
}
