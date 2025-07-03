import { ObjectId } from '@ecommerce/object-id';

export type Node = {
  _id: ObjectId;
};

export enum EventType {
  ProductCreated = 1,
}

export enum ObjectType {
  Product = 'Product',
}
