import { MongooseRepository } from 'apps/ecommerce-server/src/libs/mongoose-repository';
import { ObjectId } from 'apps/ecommerce-server/src/libs/object-id';
import { Repository } from 'apps/ecommerce-server/src/libs/repository';

import { AccountType } from 'apps/ecommerce-server/src/types/common';
import { Connection } from 'mongoose';

export type Account = {
  _id: ObjectId;
  // platform?: ObjectId | null;
  // name: string;
  password: string;
  // status: string;
  // domain?: string;
  // dateTimeCreated: Date;
  emailAddress?: string;
  mobileNumber?: string;
  // twoFADetails?: TwoFADetails;
} & (
  | {
      role: AccountType.Admin;
    }
  | {
      role: AccountType.Member;
      // secretQuestion?: string;
      // secretAnswer?: string;
      // mobileNumber?: string;
      // facebookDetails?: FacebookDetails;
      // googleDetails?: GoogleDetails;

      // verified?: boolean;
    }
);

export type AccountRepository = Repository<Account>;

export function AccountRepositoryFactory(
  connection: Connection
): AccountRepository {
  return new MongooseRepository<Account>(
    connection,
    'Accounts',
    {
      _id: ObjectId,
      // platform: Buffer,
      // name: String,
      // role: String,
      // password: String,
      // domain: String,
      // status: String,
      // dateTimeCreated: Date,
      // secretQuestion: String,
      // secretAnswer: String,
      mobileNumber: String,
      // permissions: [String],
      // facebookDetails: Schema.Types.Mixed,
      // googleDetails: Schema.Types.Mixed,
      emailAddress: String,
      password: String,
      role: String,
      // verified: Boolean,
      // parent: Buffer,
      // twoFADetails: Schema.Types.Mixed,
      // ssoPartnerDetails: Schema.Types.Mixed,
    }
    // [
    //   /** Used for finding SuperAdmin accounts. */
    //   [
    //     {
    //       name: 1,
    //       status: 1,
    //       role: 1,
    //     },
    //     // {
    //     //   partialFilterExpression: {
    //     //     status: AccountStatus.Active,
    //     //     role: AccountType.SuperAdmin,
    //     //   },
    //     // },
    //   ],
    //   // [{ platform: 1, role: 1, name: 1 }],
    //   // [{ platform: 1, role: 1, mobileNumber: 1 }],
    //   // [{ 'facebookDetails.id': 1 }],
    //   // [{ 'googleDetails.id': 1 }],
    //   // [{ platform: 1, 'ssoPartnerDetails.cinepop.user.id': 1 }],
    // ]
  );
}
