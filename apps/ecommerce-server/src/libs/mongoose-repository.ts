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
import { Filter, Repository, SortOrder, WriteOptions } from './repository';

export type RawItem = { _id: Buffer; [key: string]: unknown };

export class MongooseRepository<
  TEntity extends { _id: Types.ObjectId } = { _id: Types.ObjectId }
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
    if (opts?.sort) {
      Object.assign(options, {
        sort: opts.sort,
      });
    }
    return await this.model.find(undefined, undefined, options);
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
