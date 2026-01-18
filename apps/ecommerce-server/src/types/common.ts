import { Types } from 'mongoose';

export type Node = {
  _id: Types.ObjectId;
  nodeType: ObjectType;
};

export enum EventType {
  ProductCreated = 1,
  AccountCreated = 2,
}

export enum ObjectType {
  Product = 'Product',
  Account = 'Account',
  Cart = 'Cart',
}
export enum AccountType {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}
