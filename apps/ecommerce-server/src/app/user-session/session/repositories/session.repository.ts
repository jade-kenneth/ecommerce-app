import { ObjectId } from '@ecommerce/object-id';
import { MongooseRepository } from 'apps/ecommerce-server/src/libs/mongoose-repository';
import { Repository } from 'apps/ecommerce-server/src/libs/repository';
import { Connection } from 'mongoose';
export enum SessionStatus {
  PENDING = 'PENDING',
  READY = 'READY',
}

export type Session = {
  _id: ObjectId;
  account: ObjectId;
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
      _id: Buffer,
      account: Buffer,
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
