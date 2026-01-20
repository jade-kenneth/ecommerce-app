import { addDays, addMinutes, isAfter } from 'date-fns';
import { isBoolean, isNull, isPlainObject, isUndefined } from 'es-toolkit';
import { isNil } from 'lodash';
import z from 'zod';
import {
  ACCOUNT_ROLE,
  AUTH_ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  AUTH_REFRESH_TOKEN_LOCAL_STORAGE_KEY,
} from '../constant';
import { AccountType } from '../graphql/generated';
import { Session__Authenticated } from './type';

type StoreId = keyof Omit<Session__Authenticated, 'status'>;
type StoreValue = { [K in StoreId]?: Session__Authenticated[K] | null };

type StoreIdWithExpiration = Extract<StoreId, 'accessToken' | 'refreshToken'>;
type StoreIdWithoutExpiration = Exclude<StoreId, StoreIdWithExpiration>;

function $(id: StoreId) {
  const map: Record<StoreId, string> = {
    accessToken: AUTH_ACCESS_TOKEN_LOCAL_STORAGE_KEY,
    refreshToken: AUTH_REFRESH_TOKEN_LOCAL_STORAGE_KEY,
    role: ACCOUNT_ROLE,
  };

  return map[id];
}

type Store = {
  get: {
    (): Promise<StoreValue>;
    <T extends StoreId>(key: T): Promise<StoreValue[T]>;
  };
  set: {
    (value: StoreValue): Promise<void>;
    <T extends StoreIdWithoutExpiration>(
      key: T,
      value: StoreValue[T]
    ): Promise<void>;
    <T extends StoreIdWithExpiration>(
      key: T,
      value: StoreValue[T],
      expires: number
    ): Promise<void>;
  };
  del?: (...keys: [StoreId, ...StoreId[]]) => Promise<void>;
  clear: () => Promise<void>;
};

function set(key: string, value: string | boolean | null | undefined) {
  if (isUndefined(value)) return;

  if (isNull(value)) {
    return localStorage.removeItem(key);
  }

  if (isBoolean(value)) {
    if (value === true) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }

    return;
  }

  localStorage.setItem(key, value);
}

function setexp(
  key: string,
  val: string | boolean | null | undefined,
  exp: number
) {
  if (isUndefined(val)) return;

  if (isNull(val)) {
    return localStorage.removeItem(key);
  }

  if (isBoolean(val)) {
    if (val === true) {
      localStorage.setItem(
        key,
        JSON.stringify({
          __v: 'true',
          __t: exp,
        })
      );
    } else {
      localStorage.removeItem(key);
    }

    return;
  }

  return localStorage.setItem(
    key,
    JSON.stringify({
      __v: val,
      __t: exp,
    })
  );
}

function getexp(key: string) {
  const value = localStorage.getItem(key);
  if (isNil(value)) return undefined;

  try {
    const obj = z
      .object({
        __v: z.string(),
        __t: z.number().transform((v) => new Date(v)),
      })
      .parse(JSON.parse(value));

    if (isAfter(obj.__t, new Date())) return obj.__v;
  } catch {
    /* empty */
  }

  localStorage.removeItem(key);
  return undefined;
}

function get(key: string) {
  const val = localStorage.getItem(key) || undefined;
  return val;
}

const createStore = (): Store => {
  return {
    get(): Promise<StoreValue> {
      return new Promise<StoreValue>((resolve) => {
        const accessToken = getexp($('accessToken'));
        const refreshToken = getexp($('refreshToken'));
        const role = get($('role'));
        resolve({
          accessToken,
          refreshToken,
          role: role as AccountType,
        });
      });
    },
    set<T extends StoreId>(
      arg0: StoreValue | T,
      arg1?: StoreValue[T],
      arg2?: number
    ): Promise<void> {
      if (isPlainObject(arg0)) {
        return new Promise<void>((resolve) => {
          setexp(
            $('accessToken'),
            arg0.accessToken,
            addMinutes(new Date(), 7.5).getTime()
          );
          setexp(
            $('refreshToken'),
            arg0.refreshToken,
            addDays(new Date(), 30).getTime()
          );
          set($('role'), arg0.role);

          resolve();
        });
      }

      return new Promise<void>((resolve) => {
        resolve();
      });
    },
    clear: async () => {
      new Promise<void>((resolve) => {
        localStorage.clear();
        resolve();
      });
    },
  };
};

export const store = createStore();
