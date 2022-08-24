import { searchResults } from "./types";

export function arrayTypeGuard(query: object) {
  if (Array.isArray(query)) return query[0];
  throw new Error("Array not found");
}

export function removeNullFromObjectPropsTG(
  query: searchResults,
): NonNullable<searchResults> {
  for (let key of Object.keys(query)) {
    if (key === undefined) {
      throw new Error("Value is undefined");
    }
  }
  return query as NonNullable<searchResults>;
}

export function isNotNullOrZero<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}
