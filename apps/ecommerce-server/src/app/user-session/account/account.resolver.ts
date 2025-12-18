import { ObjectType } from '@ecommerce-app/object-shared';
import { ObjectId } from '@ecommerce/object-id';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import * as R from 'ramda';
import { CreateAccountInput } from '../../__generated/graphql-types';
import { AccountService } from './account.service';
@Resolver('AccountResolver')
export class AccountResolver {
  constructor(private readonly account: AccountService) {}

  @Mutation('createMemberAccount')
  async createMemberAccount(@Args('input') input: CreateAccountInput) {
    const data = {
      ...R.pick(['emailAddress', 'password'], input),
      _id:
        input._id ?? ObjectId.generate(ObjectType.MemberAccount).toHexString(),
    };
    await this.account.createMemberAccount(data).catch(async (err) => {
      throw err;
    });
  }
  @Mutation('createAdminAccount')
  async createAdminAccount(@Args('input') input: CreateAccountInput) {
    const data = {
      ...R.pick(['emailAddress', 'password'], input),
      _id:
        input._id ?? ObjectId.generate(ObjectType.AdminAccount).toHexString(),
    };
    await this.account.createAdminAccount(data).catch(async (err) => {
      throw err;
    });
  }
}
