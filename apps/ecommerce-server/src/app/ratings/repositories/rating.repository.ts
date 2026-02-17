import { Connection, Types } from 'mongoose';
import { MongooseRepository } from '~/mongoose-repository';
import { Repository } from '~/repository';

export type Rating = {
  _id: Types.ObjectId;
  ratings: number;
  improvement: string[];
  customImprovement: string;
  userId: string;
  userEmail: string;
  notify: boolean;
  createdAt: Date;
};

export type RatingRepository = Repository<Rating>;

export function RatingRepositoryFactory(
  connection: Connection,
): RatingRepository {
  return new MongooseRepository<Rating>(
    connection,
    'Rating',
    {
      ratings: Number,
      improvement: [String],
      customImprovement: String,
      userId: String,
      userEmail: String,
      notify: Boolean,
      createdAt: Date,
    },
    [[{ userId: 1 }], [{ userEmail: 1 }], [{ createdAt: -1 }]],
  );
}
