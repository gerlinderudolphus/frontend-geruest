import type { QueryAdapter } from "./types";

export class RestAdapter<TQuery extends Record<string, string>, TResult>
  implements QueryAdapter<TQuery, TResult>
{
  readonly kind = "rest" as const;

  constructor(
    readonly id: string,
    private readonly buildUrl: (query: TQuery) => string,
  ) {}

  async query(input: TQuery): Promise<TResult> {
    const response = await fetch(this.buildUrl(input));
    if (!response.ok) {
      throw new Error(`[${this.id}] REST ${response.status}`);
    }
    return (await response.json()) as TResult;
  }
}
