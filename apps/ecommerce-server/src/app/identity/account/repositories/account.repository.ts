import type { Connection } from 'mongoose';
import { Schema, Types } from 'mongoose';

import { MongooseRepository } from '~/mongoose-repository';
import { Repository } from '~/repository';
import { AccountType } from '~/types/common';

export type GoogleDetails = {
  id: string;
  emailAddress?: string;
  displayName?: string;
  avatarUrl?: string;
  linkedAt: Date;
};

export type Account = {
  _id: Types.ObjectId;
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
      googleDetails?: GoogleDetails;

      // verified?: boolean;
    }
);

export type AccountRepository = Repository<Account>;

export function AccountRepositoryFactory(
  connection: Connection,
): AccountRepository {
  return new MongooseRepository<Account>(
    connection,
    'Accounts',
    {
      _id: Types.ObjectId,
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
      googleDetails: Schema.Types.Mixed,
      emailAddress: String,
      password: String,
      role: String,
      // verified: Boolean,
      // parent: Buffer,
      // twoFADetails: Schema.Types.Mixed,
      // ssoPartnerDetails: Schema.Types.Mixed,
    },
    [
      [
        { 'googleDetails.id': 1 },
        {
          unique: true,
          sparse: true,
        },
      ],
    ],
  );
}
