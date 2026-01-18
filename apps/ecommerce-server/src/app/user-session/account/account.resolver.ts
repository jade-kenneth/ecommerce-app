import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Types } from 'mongoose';
import * as R from 'ramda';
import { CreateAccountInput } from '../../__generated/graphql-types';
import { Claims } from '../types';
import { AccountService } from './account.service';
@Resolver('Accounts')
export class AccountResolver {
  constructor(private readonly account: AccountService) {}

  @Mutation('createMemberAccount')
  async createMemberAccount(@Args('input') input: CreateAccountInput) {
    const data = {
      ...R.pick(['emailAddress', 'password', '_id'], input),
    };
    return this.account.createMemberAccount(data);
  }
  @Mutation('createAdminAccount')
  async createAdminAccount(@Args('input') input: CreateAccountInput) {
    const data = {
      ...R.pick(['emailAddress', 'password', '_id'], input),
    };
    return this.account.createAdminAccount(data);
  }
  @Query('memberAccounts')
  async memberAccounts() {
    return await this.account.memberAccounts();
  }

  @Query('self')
  async self(@Context('claims') claims: Claims) {
    return await this.account.findAccount({
      _id: new Types.ObjectId(claims.sub),
    });
  }
}
