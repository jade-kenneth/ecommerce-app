import { Connection, Schema, Types } from 'mongoose';

import { MongooseRepository } from '../../../../libs/mongoose-repository';
import { Repository } from '../../../../libs/repository';
import { PaymentMethod, ShippingOption } from '../../../__generated/graphql-types';

export type CheckoutMethodSettings = {
  _id: Types.ObjectId;
  shippingOptions: ShippingOption[];
  paymentMethods: PaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
};

export type CheckoutMethodSettingsRepository =
  Repository<CheckoutMethodSettings>;

export async function CheckoutMethodSettingsRepositoryFactory(
  connection: Connection,
): Promise<CheckoutMethodSettingsRepository> {
  return new MongooseRepository<CheckoutMethodSettings>(
    connection,
    'CheckoutMethodSettings',
    {
      _id: Types.ObjectId,
      shippingOptions: [Schema.Types.Mixed],
      paymentMethods: [Schema.Types.Mixed],
      createdAt: Date,
      updatedAt: Date,
    },
    [],
  );
}
