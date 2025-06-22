import { CollationOptions } from 'mongodb';
import { Types } from 'mongoose';

export type Cursor = Buffer;

export type SortOrder = 'asc' | 'desc';

export type Connection<T> = {
  totalCount?: number;
  edges: {
    node: T;
    cursor: Cursor;
  }[];
  pageInfo: {
    startCursor: Cursor | null;
    endCursor: Cursor | null;
    hasNextPage: boolean;
  };
};
export type FilterCondition<T> = {
  equal?: T;
  notEqual?: T;
  in?: T[];
  notIn?: T[];
  greaterThan?: T;
  greaterThanOrEqual?: T;
  lesserThan?: T;
  lesserThanOrEqual?: T;
  regex?: T;
  options?: T;
  text?: T;
};
export type Filter<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? U | FilterCondition<U>
    : T[P] | FilterCondition<T[P]>;
} & Record<string, unknown>;

export type Order = 'asc' | 'desc';

export class DuplicateKeyError extends Error {
  constructor(value: Record<string, unknown>) {
    super(`duplicate key error: ${JSON.stringify(value)}`);
  }
}

export type RepositoryIterator<T> = AsyncIterableIterator<T> & {
  collect(limit?: number): Promise<T[]>;
  offset(skip?: number): {
    collect(params?: {
      limit?: number;
      sort?: Order | Partial<Record<keyof T, SortOrder>>;
    }): Promise<T[]>;
  };
  connection(params: {
    first?: number;
    after?: Cursor;
    cursor?: string;
    order?: 'asc' | 'desc';
    totalCount?: boolean;
  }): Promise<Connection<T>>;
};

export interface RepositoryTransaction {
  commit(): Promise<void>;
  abort(): Promise<void>;
}

export type WriteOptions = {
  transaction?: RepositoryTransaction;
  writeConcern?: 'primary' | 'majority';
};

export interface Repository<T extends { _id: Types.ObjectId }> {
  create(data: T, opts?: WriteOptions): Promise<void>;
  update(
    filter: Types.ObjectId | Filter<T>,
    data: Partial<Omit<T, 'id'>>,
    opts?: WriteOptions & { upsert?: boolean }
  ): Promise<void>;
  delete(
    filter: Types.ObjectId | Filter<T>,
    opts?: WriteOptions
  ): Promise<void>;
  find(
    filter: Types.ObjectId | Filter<T>,
    opts?: {
      collation?: CollationOptions;
      secondaryPreferred?: true;
      explain?: true;
    }
  ): Promise<T | null>;
  list(
    filter?: Filter<T>,
    opts?: {
      sort?: Partial<Record<keyof T, SortOrder>>;
      secondaryPreferred?: true;
      explain?: true;
    }
  ): Promise<Array<T>>;
  count(
    filter?: Filter<T>,
    opts?: {
      secondaryPreferred?: true;
      explain?: true;
      limit?: number;
    }
  ): Promise<number>;
  search(
    search: string,
    filter: Filter<T>,
    opts: {
      index: string;
      path: string;
      limit?: number;
      secondaryPreferred?: true;
    }
  ): Promise<T[]>;
  increment(
    filter: Types.ObjectId | Filter<T>,
    field: string,
    amount: number,
    opts?: WriteOptions
  ): Promise<null | number>;
}

// export interface PGRepository<T extends { id: ObjectId }> {
//   create(data: T): Promise<void>;
//   update(
//     filter: Types.ObjectId | Filter<T>,
//     data: Partial<Omit<T, 'id'>>
//   ): Promise<void>;
//   delete(filter: Types.ObjectId | Filter<T>): Promise<void>;
//   find(filter: Types.ObjectId | Filter<T>): Promise<T | null>;
//   list(filter?: Filter<T>): Promise<RepositoryIterator<T>>;
//   count(filter?: Filter<T>): Promise<number>;
// }
