import { Inject, Injectable, Optional } from '@nestjs/common';
import bcrypt from 'bcrypt';
import type { Types } from 'mongoose';

import type { Filter } from '../../../libs/repository';
import { Tokens } from '../../../types/tokens';

import type {
  Account,
  AccountRepository,
} from './repositories/account.repository';

import type { AsyncEventDispatcher } from '~/async-event-module/async-event-dispatcher';
import { AccountType } from '~/types/common';

export type LinkGoogleAccountInput = {
  id: string;
  emailAddress?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
};

@Injectable()
export class AccountService {
  constructor(
    @Inject(Tokens.AccountRepository)
    private accounts: AccountRepository,
    @Optional() private readonly events?: AsyncEventDispatcher,
  ) {}

  async createMemberAccount(data: Account) {
    await this.accounts.create({
      ...data,
      emailAddress: data.emailAddress.toLowerCase(),
      password: await bcrypt.hash(data.password, 8),
      role: AccountType.Member,
    });

    if (this.events) {
      await this.events.dispatch('SuccessfulSignup', {
        emailAddress: data.emailAddress,
        firstName: data.emailAddress.split('@')[0],
      });
    }
  }

  async createAdminAccount(data: Account) {
    await this.accounts.create({
      ...data,
      emailAddress: data.emailAddress.toLowerCase(),
      password: await bcrypt.hash(data.password, 8),
      role: AccountType.Admin,
    });
  }

  async deleteAccount(filter: Types.ObjectId | Filter<Account>) {
    await this.accounts.delete(filter, { writeConcern: 'primary' });
  }

  async updateAccount(
    filter: Types.ObjectId | Filter<Account>,
    data: Partial<Omit<Account, 'id'>>,
  ) {
    await this.accounts.update(filter, data, { writeConcern: 'primary' });
  }

  // async deleteAccounts(filter: Filter<Pick<Account, 'platform'>>) {
  //   await this.accounts.delete(filter, { writeConcern: 'primary' });
  // }

  async memberAccounts() {
    return await this.accounts.list().collect();
  }

  async findAccount(filter: Types.ObjectId | Filter<Account>) {
    return this.accounts.find(filter);
  }

  async linkGoogleAccount(
    accountId: Types.ObjectId,
    input: LinkGoogleAccountInput,
  ) {
    const account = await this.accounts.find({
      role: AccountType.Member,
      _id: accountId,
    });

    if (!account) {
      throw new Error('account not found');
    }

    if (account.role !== AccountType.Member) {
      throw new Error('only member accounts can link google account');
    }

    const googleId = input.id.trim();
    if (!googleId) {
      throw new Error('google id is required');
    }

    const existingLinkedAccount = await this.accounts.find({
      'googleDetails.id': googleId,
    });
    if (existingLinkedAccount && !existingLinkedAccount._id.equals(accountId)) {
      throw new Error('google account is already linked to another account');
    }

    account.googleDetails = {
      id: googleId,
      emailAddress: input.emailAddress?.toLowerCase(),
      displayName: input.displayName ?? undefined,
      avatarUrl: input.avatarUrl ?? undefined,
      linkedAt: new Date(),
    };

    await this.accounts.update(accountId, account);
    return true;
  }

  async unlinkGoogleAccount(accountId: Types.ObjectId) {
    const account = await this.accounts.find(accountId);
    if (!account) {
      throw new Error('account not found');
    }

    if (account.role !== AccountType.Member) {
      throw new Error('only member accounts can link google account');
    }
    account.googleDetails = null;

    await this.accounts.update(accountId, account);

    return true;
  }

  async loginWithGoogle(googleId: string): Promise<Account> {
    const normalizedGoogleId = googleId.trim();
    if (!normalizedGoogleId) {
      throw new Error('google id is required');
    }

    const account = await this.accounts.find({
      'googleDetails.id': normalizedGoogleId,
    });

    if (!account) {
      throw new Error('account not found');
    }

    if (account.role !== AccountType.Member) {
      throw new Error('only member accounts can login with google account');
    }

    return account;
  }
}
