declare module "pg" {
  export class Client {
    constructor(config?: Record<string, unknown> | string);
    connect(): Promise<void>;
    query(queryText: string, values?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
    end(): Promise<void>;
  }
}
