import { ObjectId } from '../libs/object-id';

export type Node = {
  _id: ObjectId;
};

export enum EventType {
  ProductCreated = 1,
  AccountCreated = 2,
}

export enum ObjectType {
  Product = 'Product',
  Account = 'Account',
}
export enum AccountType {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}
