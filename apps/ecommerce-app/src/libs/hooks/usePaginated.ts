import { chunk } from 'lodash';
import { callIfFn } from '~/utils/callIfFn';

interface Config {
  /**
   * The page number to retrieve.
   * @default 1
   */
  page?: number;
  /**
   * The number of items per page.
   * @default 10
   */
  pageSize?: number;
}

const defaultConfig = {
  page: 1,
  pageSize: 10,
} satisfies Config;

interface Paginated<T> {
  pages: T[][];
  currentPage: T[];
  totalPages: number;
}

export function usePaginated<T>(
  itemsOrReturnsItems: T[] | (() => T[]),
  userConfig?: Config
): Paginated<T> {
  const { page, pageSize } = Object.assign({}, defaultConfig, userConfig);

  const items = callIfFn(itemsOrReturnsItems);

  if (items.length <= 0) {
    return {
      pages: [],
      currentPage: [],
      totalPages: 0,
    };
  }

  const pages = chunk(items, pageSize);
  const currentPage = pages.at(page - 1) ?? [];
  const totalPages = pages.length;

  return {
    pages,
    currentPage,
    totalPages,
  };
}
