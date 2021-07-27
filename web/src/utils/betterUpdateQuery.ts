import { Cache, QueryInput } from "@urql/exchange-graphcache";

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  updateFunction: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(queryInput, (data) => updateFunction(result, data as any) as any);
}
