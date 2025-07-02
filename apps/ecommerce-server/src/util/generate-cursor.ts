import * as R from 'ramda';
export const generateCursor = (indexOrDate: number | Date, id?: string) =>
  R.pipe(
    () => {
      const buf = Buffer.alloc(8);
      const ts =
        typeof indexOrDate === 'number'
          ? indexOrDate
          : Math.floor(new Date(indexOrDate).getTime() / 1000); // Unix seconds

      buf.writeUInt32BE(ts, 0); // write timestamp/offset
      if (id) {
        const idBytes = Buffer.from(id.slice(0, 4), 'utf8');
        idBytes.copy(buf, 4);
      }

      return buf;
    },
    (buf: Buffer) => buf.toString('base64')
  )();
