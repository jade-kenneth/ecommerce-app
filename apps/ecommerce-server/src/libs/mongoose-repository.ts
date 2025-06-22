import Decimal from 'decimal.js';
import { CollationOptions } from 'mongodb';
import {
  Connection as DBConnection,
  IndexDefinition,
  IndexOptions,
  Model,
  Schema,
  SchemaDefinition,
  Types,
} from 'mongoose';
import * as R from 'ramda';
import { Filter, Repository, SortOrder, WriteOptions } from './repository';

function normalizeFilterField(field: any): any {
  if (field === undefined) {
    return undefined;
  }

  if (
    field === null ||
    ['number', 'string', 'boolean'].includes(typeof field) ||
    field instanceof Date ||
    field instanceof Buffer
  ) {
    return field;
  }

  if (field instanceof Types.ObjectId) {
    return field;
  }

  if (field instanceof Array) {
    return R.map(normalizeFilterField, field);
  }

  if (field instanceof Decimal) {
    return new Types.Decimal128(field.toString());
  }
  console.log(typeof field, 'field type');
  throw new Error(`unsupported filter field type: ${field}`);
}
export function serializeFilter(filter: any): any {
  const data: Record<string, unknown> = R.omit(['_id'], filter);

  if (filter.id) {
    data['_id'] = filter.id;
    delete filter.id;
  }

  return R.map(serializeFilterField, data);
}

const FILTER_CONDITION_MAP = new Map([
  ['equal', '$eq'],
  ['notEqual', '$ne'],
  ['in', '$in'],
  ['notIn', '$nin'],
  ['greaterThan', '$gt'],
  ['greaterThanOrEqual', '$gte'],
  ['lesserThan', '$lt'],
  ['lesserThanOrEqual', '$lte'],
  ['regex', '$regex'],
  ['options', '$options'],
  ['text', '$text'],
  ['language', '$language'],
  ['caseSensitive', '$caseSensitive'],
  ['diacriticSensitive', '$diacriticSensitive'],
  ['search', '$search'],
  ['exists', '$exists'],
  ['index', 'index'],
  ['autocomplete', 'autocomplete'],
  ['query', 'query'],
  ['path', 'path'],
  ['fuzzy', 'fuzzy'],
]);

const FILTER_CONDITION_MAP_KEYS = [...FILTER_CONDITION_MAP.keys()];

function serializeFilterField(field: any): any {
  try {
    return normalizeFilterField(field);
  } catch (err) {
    if (field instanceof Object || Object.getPrototypeOf(field) === null) {
      const keys = R.intersection(
        R.keys(field),
        FILTER_CONDITION_MAP_KEYS
      ) as string[];

      const result: Record<string, any> = {};

      for (const key of keys) {
        const condition = FILTER_CONDITION_MAP.get(key);

        if (condition) {
          result[condition] = serializeFilterField(field[key]);
        }
      }
      console.log(result, 'result');
      return result;
    }
    throw err;
  }
}

export type RawItem = { _id: Buffer; [key: string]: unknown };

export class MongooseRepository<
  TEntity extends { _id: Types.ObjectId } = {
    _id: Types.ObjectId;
  }
> implements Repository<TEntity>
{
  private readonly _model: Model<RawItem>;

  constructor(
    connection: DBConnection,
    name: string,
    definition: SchemaDefinition,
    indexes?: [IndexDefinition, IndexOptions?][]
  ) {
    const schema = new Schema(
      {
        ...definition,
        __t: Schema.Types.Mixed,
      },
      {
        versionKey: false,
        strict: true,
      }
    );

    for (const [indexDefinition, indexOptions] of indexes || []) {
      schema.index(indexDefinition, indexOptions);
    }
    this._model = connection.model<RawItem>(name, schema);
  }
  public get model() {
    return this._model;
  }

  async create(data: TEntity, opts?: WriteOptions): Promise<void> {
    await this.model.create([data], { opts });
  }
  update(
    filter: Types.ObjectId | Filter<TEntity>,
    data: Partial<Omit<TEntity, 'id'>>,
    opts?: WriteOptions & { upsert?: boolean }
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(
    filter: Types.ObjectId | Filter<TEntity>,
    opts?: WriteOptions
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  find(
    filter: Types.ObjectId | Filter<TEntity>,
    opts?: {
      collation?: CollationOptions;
      secondaryPreferred?: true;
      explain?: true;
    }
  ): Promise<TEntity> {
    throw new Error('Method not implemented.');
  }
  async list(
    filter?: Filter<TEntity>,
    opts?: {
      sort?: Partial<Record<keyof TEntity, SortOrder>>;
      secondaryPreferred?: true;
      explain?: true;
    }
  ): Promise<Array<TEntity>> {
    const options: Record<string, never> = {};

    const serializedFilter = filter ? serializeFilter(filter) : {};
    console.log(serializedFilter, 'serializedFilter');
    if (opts?.sort) {
      Object.assign(options, {
        sort: opts.sort,
      });
    }
    return await this.model.find(serializedFilter, undefined, options);
  }
  count(
    filter?: Filter<TEntity>,
    opts?: { secondaryPreferred?: true; explain?: true; limit?: number }
  ): Promise<number> {
    throw new Error('Method not implemented.');
  }
  search(
    search: string,
    filter: Filter<TEntity>,
    opts: {
      index: string;
      path: string;
      limit?: number;
      secondaryPreferred?: true;
    }
  ): Promise<TEntity[]> {
    throw new Error('Method not implemented.');
  }
  increment(
    filter: Types.ObjectId | Filter<TEntity>,
    field: string,
    amount: number,
    opts?: WriteOptions
  ): Promise<null | number> {
    throw new Error('Method not implemented.');
  }
}
