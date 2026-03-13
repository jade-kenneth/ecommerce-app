import assert from 'assert';

import { Inject } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import * as R from 'ramda';

import { AccountType } from '../../../types/common';
import type { CreateAccountInput, LinkGoogleAccountInput } from '../../__generated/graphql-types';
import type { Claims } from '../types';

import { AccountService } from './account.service';

@Resolver('Accounts')
export class AccountResolver {
  constructor(@Inject(AccountService) private readonly account: AccountService) {}

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

  @Mutation('linkGoogleAccount')
  async linkGoogleAccount(
    @Context('claims') claims: Claims,
    @Args('input') input: LinkGoogleAccountInput,
  ) {
    assert(claims?.sub && claims?.role === AccountType.Member, 'unauthorized');
    return this.account.linkGoogleAccount(new Types.ObjectId(claims.sub), input);
  }

  @Mutation('unlinkGoogleAccount')
  async unlinkGoogleAccount(@Context('claims') claims: Claims) {
    assert(claims?.sub && claims?.role === AccountType.Member, 'unauthorized');
    return this.account.unlinkGoogleAccount(new Types.ObjectId(claims.sub));
  }

  @Query('memberAccounts')
  async memberAccounts() {
    return await this.account.memberAccounts();
  }

  @Query('self')
  async self(@Context('claims') claims: Claims) {
    assert(claims?.sub, 'unauthorized');
    return await this.account.findAccount({
      _id: new Types.ObjectId(claims.sub),
    });
  }
}
