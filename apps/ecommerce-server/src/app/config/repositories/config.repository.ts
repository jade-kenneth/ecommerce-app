import { ObjectId } from '@ecommerce/object-id';
import { MongooseRepository } from 'apps/ecommerce-server/src/libs/mongoose-repository';
import { Repository } from 'apps/ecommerce-server/src/libs/repository';
import { Node } from 'apps/ecommerce-server/src/types/common';
import { Connection } from 'mongoose';

export type Config = Node & {
  highPointsThreshold: number;
  topSoldThreshold: number;
  carouselItems: string[];
};

export type ConfigRepository = Repository<Config>;

export async function ConfigRepositoryFactory(
  connection: Connection
): Promise<ConfigRepository> {
  return new MongooseRepository<Config>(connection, 'Config', {
    _id: ObjectId,
    highPointsThreshold: Number,
    topSoldThreshold: Number,
    carouselItems: [String],
  });
}
