import { Types } from 'mongoose';
/**
 * @deprecated
 */
/**
 * Generate a single ObjectId.
 * @returns {ObjectId}
 */

/**
 * @deprecated
 */
export function generateObjectId() {
  return new Types.ObjectId();
}

/**
 * Generate a single ObjectId as a string.
 * @returns {string}
 */

/**
 * @deprecated
 */
export function generateObjectIdString() {
  return new Types.ObjectId().toHexString();
}

/**
 * Generate an array of ObjectId strings.
 * @param {number} count
 * @returns {string[]}
 */

/**
 * @deprecated
 */
export function generateMultipleObjectIdStrings(count: number) {
  return Array.from({ length: count }, () =>
    new Types.ObjectId().toHexString()
  );
}
