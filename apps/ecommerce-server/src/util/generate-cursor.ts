import { createHash } from 'crypto';
import * as R from 'ramda';
import { ObjectId } from '../libs/object-id';

type Argument = number | bigint | string | ObjectId | Date | null | undefined;

export function generateCursor(...args: Argument[]): Buffer {
  return Buffer.concat(
    R.map((value: unknown) => {
      if (typeof value === 'number') {
        const buffer = Buffer.alloc(4, 0);

        buffer.writeUInt32BE(
          Math.floor(Math.max(0, Math.min(value, 0xffffffff)))
        );

        return buffer;
      }

      if (typeof value === 'bigint') {
        const buffer = Buffer.alloc(8, 0);

        buffer.writeBigUInt64BE(value);

        return buffer;
      }

      if (typeof value === 'string') {
        return Buffer.from(value.substring(0, 16).padEnd(16, ' '), 'utf8');
      }

      if (value instanceof Date) {
        const buffer = Buffer.alloc(8, 0);

        buffer.writeBigUInt64BE(BigInt(value.getTime()));

        return buffer;
      }

      if (value instanceof ObjectId) {
        return hash(value.toString()).subarray(0, 6);
      }

      if (value === null || value === undefined) {
        return Buffer.alloc(4, 0);
      }

      throw new Error(
        `value type is not supported: value=${value} type=${typeof value}`
      );
    }, args).map((buffer) => Uint8Array.from(buffer))
  );
}

export function hash(message: string, algorithm = 'sha256') {
  return createHash(algorithm).update(message).digest();
}
