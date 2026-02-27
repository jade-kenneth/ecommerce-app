import { Connection, Types } from 'mongoose';

import { MongooseRepository } from '../../../libs/mongoose-repository';
import { Repository } from '../../../libs/repository';

export type ProductReview = {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  accountId: Types.ObjectId;
  orderId?: Types.ObjectId;
  rating: number;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductReviewsRepository = Repository<ProductReview>;

export async function ProductReviewsRepositoryFactory(
  connection: Connection,
): Promise<ProductReviewsRepository> {
  return new MongooseRepository<ProductReview>(
    connection,
    'ProductReviews',
    {
      _id: Types.ObjectId,
      productId: Types.ObjectId,
      accountId: Types.ObjectId,
      orderId: Types.ObjectId,
      rating: Number,
      message: String,
      createdAt: Date,
      updatedAt: Date,
    },
    [[{ productId: 1 }], [{ accountId: 1 }], [{ createdAt: -1 }]],
  );
}
