import { BrandMark, FallbackShell } from './FallbackShell';

export function DefaultLoading() {
  return (
    <FallbackShell
      tone="loading"
      backgroundClassName="bg-gradient-to-b from-slate-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900"
    >
      <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:rounded-3xl sm:p-8 dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex flex-col items-center text-center">
          <BrandMark tone="loading" />
          <div className="relative mb-4 mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 ring-1 ring-cyan-100 sm:h-16 sm:w-16 dark:bg-cyan-950/40 dark:ring-cyan-900/60">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600 sm:h-8 sm:w-8 dark:border-cyan-900 dark:border-t-cyan-400" />
          </div>

          <h2 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
            Checking Admin Access
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-sm dark:text-slate-300">
            We are verifying your session and permissions before loading the
            admin page.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-gray-800 dark:bg-gray-900/70" />
          <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-gray-800 dark:bg-gray-900/70" />
          <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-gray-800 dark:bg-gray-900/70" />
        </div>
      </div>
    </FallbackShell>
  );
}

