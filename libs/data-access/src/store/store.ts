import { addDays, addMinutes, isAfter } from 'date-fns';
import { isBoolean, isNull, isPlainObject, isUndefined } from 'es-toolkit';
import { isNil } from 'lodash';
import z from 'zod';
import { AccountType } from '~/graphql/generated';
import { Session__Authenticated } from '~/providers/AuthProvider';
import {
  ACCOUNT_ROLE,
  AUTH_ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  AUTH_REFRESH_TOKEN_LOCAL_STORAGE_KEY,
  LICENSE_CODE_LOCAL_STORAGE_KEY,
} from '~/utils/constant';

type License = {
  licenseCode: string;
};

type AuthId = keyof Omit<Session__Authenticated, 'status'>;
type LicenseId = keyof License;

type StoreValue = { [K in AuthId]?: Session__Authenticated[K] | null } & {
  [X in LicenseId]?: License[X] | null;
};

type AuthIdWithExpiration = Extract<AuthId, 'accessToken' | 'refreshToken'>;
type AuthIdWithoutExpiration = Exclude<AuthId, AuthIdWithExpiration>;

type StoreKey = AuthId | LicenseId;

function $(id: StoreKey) {
  const map: Record<StoreKey, string> = {
    accessToken: AUTH_ACCESS_TOKEN_LOCAL_STORAGE_KEY,
    refreshToken: AUTH_REFRESH_TOKEN_LOCAL_STORAGE_KEY,
    role: ACCOUNT_ROLE,
    licenseCode: LICENSE_CODE_LOCAL_STORAGE_KEY,
  };

  return map[id];
}

type Store = {
  get: {
    (): Promise<StoreValue>;
    <T extends StoreKey>(key: T): Promise<StoreValue[T]>;
  };
  set: {
    (value: StoreValue): Promise<void>;
    <T extends AuthIdWithoutExpiration>(
      key: T,
      value: StoreValue[T],
    ): Promise<void>;
    <T extends AuthIdWithExpiration & LicenseId>(
      key: T,
      value: StoreValue[T],
      expires: number,
    ): Promise<void>;
  };
  del?: (...keys: [StoreKey, ...StoreKey[]]) => Promise<void>;
  clearSession: () => Promise<void>;
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
  exp: number,
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
        }),
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
    }),
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
function del(...keys: string[]) {
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
}
const createStore = (): Store => {
  return {
    get(): Promise<StoreValue> {
      return new Promise<StoreValue>((resolve) => {
        const accessToken = getexp($('accessToken'));
        const refreshToken = getexp($('refreshToken'));
        const role = get($('role'));
        const licenseCode = getexp($('licenseCode'));
        resolve({
          accessToken,
          refreshToken,
          role: role as AccountType,
          licenseCode,
        });
      });
    },
    set<T extends StoreKey>(
      arg0: StoreValue | T,
      arg1?: StoreValue[T],
      arg2?: number,
    ): Promise<void> {
      if (isPlainObject(arg0)) {
        return new Promise<void>((resolve) => {
          setexp(
            $('accessToken'),
            arg0.accessToken,
            addMinutes(new Date(), 7.5).getTime(),
          );
          setexp(
            $('refreshToken'),
            arg0.refreshToken,
            addDays(new Date(), 30).getTime(),
          );
          setexp(
            $('licenseCode'),
            arg0.licenseCode?.split('@')[0].toString() ?? '',
            new Date(arg0.licenseCode?.split('@')[1] as string).getTime() ?? '',
          );
          set($('role'), arg0.role);
          resolve();
        });
      }

      return new Promise<void>((resolve) => {
        resolve();
      });
    },
    del(...keys) {
      return new Promise((resolve) => {
        del(...keys.map((k) => $(k)));
        resolve();
      });
    },
    clearSession() {
      return new Promise((resolve) => {
        del($('role'), $('accessToken'), $('refreshToken'));
        resolve();
      });
    },
  };
};

export const store = createStore();
