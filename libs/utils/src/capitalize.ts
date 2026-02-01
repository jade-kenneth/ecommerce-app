interface CapitalizeConfig {
  /**
   * @description The delimiter used to split the string into words.
   * @default ' '
   */
  delimiter?: string | RegExp;
  /**
   * @description Whether to convert the string to lowercase before capitalizing.
   * @default true
   */
  lower?: boolean;
  /**
   * @description Whether to trim the string before capitalizing.
   * @default true
   */
  trim?: boolean;
}

const SPACE = /\s/g;
const UNDERSCORE = /_/g;
const DASH = /-/g;
const PASCAL = /(?=[A-Z])/;

/**
 * @example
 * ```ts
 * capitalize('foo bar baz') // 'Foo Bar Baz'
 * capitalize('foo_bar_baz', { delimiter: capitalize.delimiters.UNDERSCORE }) // 'Foo Bar Baz'
 * ```
 */
export function capitalize(subject: string, config?: CapitalizeConfig) {
  const trim = config?.trim ?? true;
  const lower = config?.lower ?? true;
  const delimiter = config?.delimiter ?? SPACE;

  if (trim) subject = subject.trim();

  if (subject.length < 2) {
    return subject.toUpperCase();
  }

  if (delimiter instanceof RegExp) {
    delimiter.lastIndex = 0;
  }

  return subject
    .split(delimiter)
    .map((word) => {
      if (word.length < 2) return word.toUpperCase();

      const firstChar = word.charAt(0).toUpperCase();
      const otherChars = lower
        ? word.substring(1).toLowerCase()
        : word.substring(1);

      return firstChar.concat(otherChars);
    })
    .join(' ');
}

capitalize.delimiters = {
  SPACE,
  UNDERSCORE,
  DASH,
  /**
   * ```
   * SpotBonus => Spot Bonus
   * GenericPromo => Generic Promo
   * ```
   */
  PASCAL,
};
