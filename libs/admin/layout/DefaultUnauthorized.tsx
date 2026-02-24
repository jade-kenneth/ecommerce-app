import { BrandMark, FallbackShell } from './FallbackShell';

interface DefaultUnauthorizedProps {
  message: string;
}

export function DefaultUnauthorized({ message }: DefaultUnauthorizedProps) {
  return (
    <FallbackShell
      tone="danger"
      backgroundClassName="bg-gradient-to-b from-rose-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900"
    >
      <div className="w-full rounded-2xl border border-rose-200 bg-white/95 p-5 shadow-sm sm:rounded-3xl sm:p-8 dark:border-rose-900/60 dark:bg-gray-950/85">
        <div className="flex flex-col items-center text-center">
          <BrandMark
            tone="danger"
            className="mb-4 mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 ring-1 ring-rose-200 sm:h-16 sm:w-16 dark:bg-rose-950/50 dark:ring-rose-900/60"
          />

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">
            Access Restricted
          </p>
          <h2 className="mt-2 text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
            Unable to open this admin page
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-sm dark:text-slate-300">
            {message}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50/70 p-3 text-left sm:p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
          <p className="text-xs text-center leading-5 text-rose-800 sm:text-sm dark:text-rose-200">
            If this is unexpected, sign in again or contact an administrator to
            confirm your account role and access level.
          </p>
        </div>
      </div>
    </FallbackShell>
  );
}

