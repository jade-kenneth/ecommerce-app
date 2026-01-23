import { Connection, Types } from 'mongoose';
import { MongooseRepository } from '~/mongoose-repository';
import { Repository } from '~/repository';

export enum SessionStatus {
  PENDING = 'PENDING',
  READY = 'READY',
}

export type Session = {
  _id: Types.ObjectId;
  account: Types.ObjectId;
  jti: Buffer;
  dateTimeCreated: Date;
  dateTimeLastRefreshed: Date;
  fingerprint?: string;
  status?: SessionStatus;
};
export type SessionRepository = Repository<Session>;
export function SessionRepositoryFactory(
  connection: Connection
): SessionRepository {
  return new MongooseRepository<Session>(
    connection,
    'Session',
    {
      account: Types.ObjectId,
      jti: Buffer,
      dateTimeCreated: Date,
      dateTimeLastRefreshed: Date,
      fingerprint: String,
      status: String,
    },
    [
      [{ account: 1 }], // recommended by MongoDB
      [{ jti: 1, account: 1, fingerprint: 1 }],
      [{ dateTimeLastRefreshed: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }],
    ]
  );
}
