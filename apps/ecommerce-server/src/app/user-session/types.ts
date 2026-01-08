import { Request } from 'express';
import { ObjectId } from '../../libs/object-id';
import { AccountType } from '../../types/common';
import { Account } from './account/repositories/account.repository';
import { Session } from './session/repositories/session.repository';

export type AuthRequest = Request & {
  user: Account;
  session: Session;
  ipAddress?: string;
  location?: string;
  forVerification?: boolean;
  scheme?: string;
};
export enum TokenType {
  Access = 'access',
  Refresh = 'refresh',
}
export type AdminAccount = Account & {
  type: AccountType.Admin;
  platform: ObjectId;
  // twoFADetails?: TwoFADetails;
};
export type MemberAccount = Account & {
  type: AccountType.Member;
  platform: ObjectId;
  realName?: string;
  nickName?: string;
  emailAddress?: string;
  mobileNumber?: string;
};
