import { parse } from "url";

export function parseUrl(url) {
  return parse(url, true);
}
