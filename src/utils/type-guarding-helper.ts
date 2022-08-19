export function arrayTypeGuard(query: object) {
  if (Array.isArray(query)) return query[0];
  throw new Error("Array not found");
}
