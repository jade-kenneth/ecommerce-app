import { ObjectId, Types } from 'mongoose';
import randomBytes from 'randombytes';
const MACHINE_ID = randomBytes(5);

let counter = randomBytes(4).readUInt32BE(0) & 0xffffff;

// export class ObjectId {
//   private _buffer: Buffer;

//   public constructor(buffer: Buffer) {
//     this._buffer = buffer;
//   }

//   public static translate(id: ObjectId, type: number) {
//     const buffer = Buffer.from(<Uint8Array>id._buffer);

//     buffer[0] = type & 0xff;

//     return ObjectId.from(buffer);
//   }

//   public static generate(type?: number) {
//     const buffer = Buffer.alloc(13);

//     const time = Math.floor(Date.now() / 1000) & 0xffffffff;

//     counter = (counter + 1) & 0xffffff;

//     buffer[0] = (type ?? 0) & 0xff;
//     buffer[1] = (time >> 24) & 0xff;
//     buffer[2] = (time >> 16) & 0xff;
//     buffer[3] = (time >> 8) & 0xff;
//     buffer[4] = time & 0xff;
//     buffer[5] = MACHINE_ID[0];
//     buffer[6] = MACHINE_ID[1];
//     buffer[7] = MACHINE_ID[2];
//     buffer[8] = MACHINE_ID[3];
//     buffer[9] = MACHINE_ID[4];
//     buffer[10] = (counter >> 16) & 0xff;
//     buffer[11] = (counter >> 8) & 0xff;
//     buffer[12] = counter & 0xff;

//     return new ObjectId(buffer);
//   }

//   public static from(value: string | Buffer) {
//     if (typeof value === 'string') {
//       if (value.length > 20) {
//         throw new Error('String value exceeds the limit of 20 characters');
//       }

//       return new ObjectId(Buffer.from(bs58.decode(value)));
//     }

//     if (value instanceof Buffer) {
//       return new ObjectId(value);
//     }

//     throw new Error('Invalid value type. Expected string or Buffer.');
//   }
// }

/**
 * Generate a single ObjectId.
 * @returns {ObjectId}
 */
export function generateObjectId() {
  return new Types.ObjectId();
}

/**
 * Generate a single ObjectId as a string.
 * @returns {string}
 */
export function generateObjectIdString() {
  return new Types.ObjectId().toHexString();
}

/**
 * Generate an array of ObjectId strings.
 * @param {number} count
 * @returns {string[]}
 */
export function generateMultipleObjectIdStrings(count: number) {
  return Array.from({ length: count }, () =>
    new Types.ObjectId().toHexString()
  );
}
