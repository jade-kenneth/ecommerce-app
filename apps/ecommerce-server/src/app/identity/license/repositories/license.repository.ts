import type { Connection } from 'mongoose';
import { Types } from 'mongoose';
import type { LicenseVariant } from 'src/app/__generated/graphql-types';

import { MongooseRepository } from '~/mongoose-repository';
import { Repository } from '~/repository';
import { Node } from '~/types/common';

export type License = Node & {
  _id: Types.ObjectId;
  expirationDate?: string | null;
  code: string;
  variant: LicenseVariant;
};

export type LicenseRepository = Repository<License>;

export function LicenseRepositoryFactory(
  connection: Connection,
): LicenseRepository {
  return new MongooseRepository<License>(connection, 'License', {
    _id: Types.ObjectId,
    expirationDate: String,
    code: String,
    variant: String,
  });
}
