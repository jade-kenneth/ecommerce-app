import { ObjectId } from '@ecommerce/object-id';
import Decimal from 'decimal.js';
import { CollationOptions, Decimal128 } from 'mongodb';
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
import {
  Connection,
  Filter,
  Repository,
  RepositoryIterator,
  SortOrder,
  WriteOptions,
} from './repository';

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

  if (field instanceof ObjectId) {
    return field;
  }

  if (field instanceof Array) {
    return R.map(normalizeFilterField, field);
  }

  if (field instanceof Decimal) {
    return new Types.Decimal128(field.toString());
  }

  throw new Error(`unsupported filter field type: ${field}`);
}
export function serializeFilter(filter: any): any {
  /**
   *
   * This function serializes a filter object to be compatible with MongoDB's query format.
   * Note: changing the graphql schema is not recommended as graphql playground doesnt support
   * $ on operators like $eq, $gt, etc.
   * so instead we serialize the filter object
   * to be compatible with the MongoDB query format.
   */
  const data: Record<string, unknown> = R.omit(['id'], filter);

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

const serializeItem = (obj: Record<string, any>) => {
  /** This function serializes an item to ensure that
   * Decimal128 values are converted to strings. */
  const result: Record<string, any> = {};
  for (const key in obj) {
    const val = obj[key];
    result[key] = val instanceof Decimal128 ? val.toString() : val;
  }
  return result;
};

const FILTER_CONDITION_MAP_KEYS = [...FILTER_CONDITION_MAP.keys()];

function serializeFilterField(field: any): any {
  try {
    return normalizeFilterField(field);
  } catch (err) {
    /** this transforms filter field
     *  to be accepted by mongodb format
     *  example:
     * { equal: 'value' } => { $eq: 'value' }
     * { greaterThan: 10 } => { $gt: 10 }
     */
    if (field instanceof Object || Object.getPrototypeOf(field) === null) {
      /** get array intersection
       * ["equal"], ["equal", "notEqual"]
       * => ["equal"]
       * ["equal", "notEqual"], ["in"]
       * => []
       * this is used to get the keys that are in the FILTER_CONDITION_MAP
       * and then map them to the corresponding value in the FILTER_CONDITION_MAP
       */
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

      return result;
    }
    throw err;
  }
}
export function flattenObject(item: any, parentKey?: string): Partial<RawItem> {
  return R.compose(
    R.reduce((accum, [key, value]: [string, unknown]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof value === 'object' &&
        value !== null &&
        !(value instanceof Array) &&
        !(value instanceof ObjectId) &&
        !(value instanceof Decimal) &&
        !(value instanceof Date) &&
        !(value instanceof Buffer)
      ) {
        return R.mergeRight(accum, flattenObject(value, newKey));
      }

      return {
        ...accum,
        [newKey]: value,
      };
    }, {}),
    R.toPairs
  )(item) as never;
}

export type RawItem = { _id: Buffer; [key: string]: unknown };

export class MongooseRepository<
  TEntity extends { _id: ObjectId } = {
    _id: ObjectId;
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
    console.log(data, 'data to create');
    try {
      await this.model.create([data], { opts });
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }
  update(
    filter: ObjectId | Filter<TEntity>,
    data: Partial<Omit<TEntity, 'id'>>,
    opts?: WriteOptions & { upsert?: boolean }
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(
    filter: ObjectId | Filter<TEntity>,
    opts?: WriteOptions
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  find(
    filter: ObjectId | Filter<TEntity>,
    opts?: {
      collation?: CollationOptions;
      secondaryPreferred?: true;
      explain?: true;
    }
  ): Promise<TEntity> {
    throw new Error('Method not implemented.');
  }

  list(
    filter?: Filter<TEntity>,
    opts?: {
      sort?: Partial<Record<keyof TEntity, SortOrder>>;
      secondaryPreferred?: true;
      explain?: true;
    }
  ): RepositoryIterator<TEntity> {
    const model = this.model;
    const options: Record<string, never> = {};

    const serializedFilter = filter ? serializeFilter(filter) : {};

    if (opts?.sort) {
      Object.assign(options, {
        sort: opts.sort,
      });
    }

    const iterator = {
      [Symbol.asyncIterator]: () => {
        const cursor = model.find(serializedFilter, null, options).cursor();

        return {
          next: () =>
            cursor.next().then((value) => ({
              value: serializeItem(value) as TEntity,
              done: value == null,
            })),
        };
      },
      collect: async (limit = 0): Promise<TEntity[]> => {
        const values: TEntity[] = [];

        for await (const value of model
          .find(serializedFilter, null, options)
          .limit(limit)) {
          values.push(serializeItem(value) as TEntity);
        }

        return values;
      },

      connection: async (params: {
        first?: number;
        after?: string;
        cursor?: string;
        order?: 'asc' | 'desc';
        totalCount?: false;
      }): Promise<Connection<TEntity>> => {
        const limit = params.first || 100;
        const key = params.cursor || 'cursor';

        let filter = serializedFilter;

        const operator = params.order === 'desc' ? '$lt' : '$gt';

        if (params.after) {
          filter = {
            ...serializedFilter,
            [key]: {
              [operator]: Buffer.from(params.after, 'base64'),
            },
          };
        }

        const [values, totalCount] = await Promise.all([
          (async () => {
            return await model
              .find(filter, null, {
                sort: { [key]: params.order === 'desc' ? -1 : 1 },
                limit: limit + 1,
              })
              .lean();
          })(),
          (async () => {
            if (params.totalCount === false) {
              return;
            }

            const totalCount = await model.countDocuments(serializedFilter, {
              ...R.pick(['readPreference'], options),
              limit: 100000,
            });

            return totalCount;
          })(),
        ]);
        console.log(values, 'values');
        console.log(filter, 'filter');
        if (R.isEmpty(values)) {
          return {
            totalCount: 0,
            edges: [],
            pageInfo: {
              hasNextPage: false,
              startCursor: null,
              endCursor: null,
            },
          };
        }

        const hasNextPage = values.length > limit;

        if (hasNextPage) values.pop();

        const edges = R.map((value: any) => {
          return {
            node: serializeItem(value),
            cursor: value[key],
          };
        }, values);

        return {
          edges,
          pageInfo: {
            hasNextPage,
            startCursor: R.prop(key, R.head(edges)) as unknown as Buffer,
            endCursor: R.prop(key, R.last(edges)) as unknown as Buffer,
          },
          totalCount: totalCount,
        };
      },
    } as RepositoryIterator<TEntity>;

    return iterator;
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
    filter: ObjectId | Filter<TEntity>,
    field: string,
    amount: number,
    opts?: WriteOptions
  ): Promise<null | number> {
    throw new Error('Method not implemented.');
  }
}
