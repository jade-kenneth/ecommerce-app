import bs58 from 'bs58';

import randomBytes from 'randombytes';

/**
 *
 * This class represents a unique identifier for objects, similar to MongoDB's ObjectId.
 * It is a 13-byte buffer that includes a type byte, a timestamp, a machine ID, and a counter.
 * * The first byte represents the type of the object, which can be used to differentiate between different kinds of objects.
 * * The next 4 bytes represent the timestamp in seconds since the Unix epoch.
 * * The next 5 bytes represent a machine ID, which can be used to identify the machine that generated the ID.
 * * The last 3 bytes represent a counter, which is incremented each time an ID is generated on the same machine within the same second.
 *
 *
 *
 */
const MACHINE_ID = randomBytes(5);

let counter = randomBytes(4).readUInt32BE(0) & 0xffffff;

export class ObjectId {
  private _buffer: Buffer;

  public constructor(buffer: Buffer) {
    this._buffer = buffer;
  }

  // public static translate(id: ObjectId, type: number) {
  //   const buffer = Buffer.from(<Uint8Array>id.buffer);

  //   buffer[0] = type & 0xff;

  //   return ObjectId.from(buffer);
  // }
  /**
   * Generates a new ObjectId.
   * * @param type - An optional type byte to differentiate between different kinds of objects.
   * * If not provided, defaults to 0.
   *
   *
   */
  public static generate(type: number = 0): ObjectId {
    if (type < 0 || type > 7) {
      throw new Error('Type must be between 0 and 7 (fits in 3 bits)');
    }

    const buffer = Buffer.alloc(12);

    const time = Math.floor(Date.now() / 1000) & 0xffffffff;
    counter = (counter + 1) & 0xffffff;

    buffer[0] = (type ?? 0) & 0xff;
    buffer[1] = (time >> 16) & 0xff;
    buffer[2] = (time >> 8) & 0xff;
    buffer[3] = time & 0xff;

    buffer[4] = MACHINE_ID[0];
    buffer[5] = MACHINE_ID[1];
    buffer[6] = MACHINE_ID[2];
    buffer[7] = MACHINE_ID[3];
    buffer[8] = MACHINE_ID[4];

    buffer[9] = (counter >> 16) & 0xff;
    buffer[10] = (counter >> 8) & 0xff;
    buffer[11] = counter & 0xff;

    return new ObjectId(buffer);
  }
  // public static async generateFromKey(type: number, key: string) {
  //   const buffer = Buffer.alloc(13);

  //   buffer[0] = type & 0xff;

  //   Buffer.from(await sha256(key, { outputFormat: 'buffer' })).copy(
  //     <Uint8Array>buffer,
  //     1,
  //     0,
  //     12
  //   );

  //   return new ObjectId(buffer);
  // }

  public static from(value: string | Buffer) {
    if (typeof value === 'string') {
      if (value.length > 20) {
        throw new Error('String value exceeds the limit of 20 characters');
      }

      return new ObjectId(Buffer.from(bs58.decode(value)));
    }

    if (value instanceof Buffer) {
      return new ObjectId(value);
    }

    throw new Error('Invalid value type. Expected string or Buffer.');
  }

  public get type() {
    return this.buffer[0];
  }

  public get buffer() {
    return this._buffer;
  }

  // public compare(other: ObjectId) {
  //   return this._buffer.compare(<Uint8Array>other._buffer);
  // }

  // public equals(other: ObjectId) {
  //   return this._buffer.equals(<Uint8Array>other._buffer);
  // }

  // public clone() {
  //   const buffer = Buffer.alloc(13);
  //   this.buffer.copy(<Uint8Array>buffer);
  //   return ObjectId.from(buffer);
  // }

  // public toString(encoding?: 'bs58' | 'hex' | 'base64') {
  //   if (!encoding || encoding === 'bs58') {
  //     return bs58.encode(<Uint8Array>this._buffer);
  //   }

  //   return this._buffer.toString(encoding);
  // }

  public toString(): string {
    return this._buffer.toString('hex'); // 24-char hex string
  }
  /**
   *
   * @deprecated
   */
  public static extractType(value: string | Buffer): number {
    let buffer: Buffer;

    if (typeof value === 'string') {
      if (value.length !== 24) {
        throw new Error('Hex string must be 24 characters (12 bytes)');
      }
      buffer = Buffer.from(value, 'hex');
    } else if (value instanceof Buffer) {
      if (value.length !== 12) {
        throw new Error('Buffer must be 12 bytes');
      }
      buffer = value;
    } else {
      throw new Error('Expected hex string or Buffer');
    }

    return (buffer[0] >> 5) & 0x07; // Extract top 3 bits of first byte
  }
}
