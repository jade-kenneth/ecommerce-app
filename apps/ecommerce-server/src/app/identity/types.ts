import type { Request } from 'express';

import type { ObjectId } from '../../libs/object-id';
import type { AccountType } from '../../types/common';

import type { Account } from './account/repositories/account.repository';
import type { Session } from './session/repositories/session.repository';

export type AuthRequest = Request & {
  user: Account;
  session: Session;
  ipAddress?: string;
  location?: string;
  forVerification?: boolean;
  scheme?: string;
  claims: Claims;
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
export type Claims = {
  sub: string;
  type: TokenType;
  session: string;
  role: AccountType;
  iap: string;
  jti?: string;
  platform?: string;
};
