import Image from 'next/image';
import type { ReactNode } from 'react';

export type FallbackTone = 'loading' | 'danger';

function FloatingBrandBackdrop({ tone }: { tone: FallbackTone }) {
  const glowClass =
    tone === 'danger'
      ? 'from-rose-200/40 via-rose-100/10 to-transparent dark:from-rose-900/20 dark:via-rose-900/5'
      : 'from-cyan-200/40 via-cyan-100/10 to-transparent dark:from-cyan-900/20 dark:via-cyan-900/5';

  const logos = [
    'pointer-events-none absolute -left-8 -top-8 w-24 rotate-[-18deg] opacity-[0.08] blur-[1.2px] sm:-left-10 sm:-top-10 sm:w-32 lg:w-40',
    'pointer-events-none absolute -right-8 -top-6 w-20 rotate-[14deg] opacity-[0.06] blur-[1px] sm:-right-10 sm:-top-8 sm:w-28 lg:w-36',
    'pointer-events-none absolute -left-10 top-1/2 hidden w-20 -translate-y-1/2 rotate-[-10deg] opacity-[0.05] blur-[1.5px] sm:block sm:w-28 lg:w-36',
    'pointer-events-none absolute -right-10 top-[48%] hidden w-20 -translate-y-1/2 rotate-[10deg] opacity-[0.07] blur-[1.2px] sm:block sm:w-28 lg:w-36',
    'pointer-events-none absolute -bottom-8 -left-6 w-24 rotate-[12deg] opacity-[0.1] blur-[1px] sm:-bottom-10 sm:-left-8 sm:w-32 lg:w-40',
    'pointer-events-none absolute -bottom-10 -right-8 w-24 rotate-[-12deg] opacity-[0.08] blur-[1.2px] sm:-bottom-12 sm:-right-10 sm:w-32 lg:w-44',
  ] as const;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(17,24,39,0.6),transparent_70%)]" />
      <div
        className={`absolute inset-x-0 top-1/2 mx-auto h-56 w-56 -translate-y-1/2 rounded-full bg-gradient-to-br blur-3xl sm:h-72 sm:w-72 ${glowClass}`}
      />
      {logos.map((className, index) => (
        <div
          key={`${tone}-logo-${index}`}
          className={`${className} drop-shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:drop-shadow-[0_12px_30px_rgba(0,0,0,0.25)]`}
        >
          <Image
            src="/Logo.png"
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            className="h-auto w-full object-contain select-none"
          />
        </div>
      ))}
    </div>
  );
}

export function BrandMark({
  tone,
  className = '',
}: {
  tone: FallbackTone;
  className?: string;
}) {
  const ringClass =
    tone === 'danger'
      ? 'bg-white/80 ring-1 ring-rose-200 dark:bg-gray-950/70 dark:ring-rose-900/60'
      : 'bg-white/80 ring-1 ring-cyan-200 dark:bg-gray-950/70 dark:ring-cyan-900/60';

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl p-2 sm:p-2.5 ${ringClass} ${className}`}
    >
      <Image
        src="/Logo.png"
        alt="Amy logo"
        width={36}
        height={36}
        className="h-8 w-8 object-contain sm:h-9 sm:w-9"
        priority
      />
    </div>
  );
}

export function FallbackShell({
  tone,
  backgroundClassName,
  children,
}: {
  tone: FallbackTone;
  backgroundClassName: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden px-4 py-6 sm:px-6 sm:py-10 ${backgroundClassName}`}
    >
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <FloatingBrandBackdrop tone={tone} />
        <div className="relative z-10 w-full max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
