import { ObjectId } from 'mongodb';

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

export type SchemaEntity = {
  _id: ObjectId;
  [key: string]: unknown;
};
/** @deprecated */
export type Filter<T extends SchemaEntity> = {
  [K in keyof T]?: T[K] extends string
    ? string | FilterCondition<string>
    : T[K] extends number
    ? number | FilterCondition<number>
    : T[K] extends boolean
    ? boolean | FilterCondition<boolean>
    : T[K] extends Date
    ? Date | FilterCondition<Date>
    : T[K] extends Array<infer U>
    ? U[] | FilterCondition<U>
    : T[K];
};
