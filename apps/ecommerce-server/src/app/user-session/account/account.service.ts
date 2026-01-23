import { Inject, Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { AccountType } from '~/types/common';
import { Filter } from '../../../libs/repository';
import { Tokens } from '../../../types/tokens';
import { Account, AccountRepository } from './repositories/account.repository';

@Injectable()
export class AccountService {
  constructor(
    @Inject(Tokens.AccountRepository)
    private accounts: AccountRepository
  ) {}

  async createMemberAccount(data: Account) {
    await this.accounts.create({
      ...data,
      emailAddress: data.emailAddress.toLowerCase(),
      password: await bcrypt.hash(data.password, 8),
      role: AccountType.Member,
    });
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
    data: Partial<Omit<Account, 'id'>>
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
}
