import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as R from 'ramda';
import { CreateAccountInput } from '../../__generated/graphql-types';
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
}
