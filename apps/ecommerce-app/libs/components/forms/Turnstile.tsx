'use client';

import React from 'react';

const RENDER_POLL_INTERVAL_MS = 250;

export type TurnstileHandle = {
  reset: () => void;
};

type TurnstileProps = {
  action: string;
  className?: string;
  onTokenChange: (token: string | null) => void;
  theme?: 'auto' | 'light' | 'dark';
};

export const Turnstile = React.forwardRef<TurnstileHandle, TurnstileProps>(
  function Turnstile(
    { action, className, onTokenChange, theme = 'light' },
    ref,
  ) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const widgetIdRef = React.useRef<string | null>(null);
    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

    React.useImperativeHandle(
      ref,
      () => ({
        reset() {
          if (
            !widgetIdRef.current ||
            typeof window === 'undefined' ||
            !window.turnstile
          ) {
            return;
          }

          onTokenChange(null);
          window.turnstile.reset(widgetIdRef.current);
        },
      }),
      [onTokenChange],
    );

    React.useEffect(() => {
      if (!siteKey || !containerRef.current) {
        onTokenChange(null);
        return;
      }

      let isDisposed = false;
      let intervalId: number | null = null;

      const clearWidget = () => {
        const turnstile = typeof window === 'undefined' ? null : window.turnstile;

        if (widgetIdRef.current && turnstile?.remove) {
          turnstile.remove(widgetIdRef.current);
        }

        widgetIdRef.current = null;

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        onTokenChange(null);
      };

      const renderWidget = () => {
        const turnstile = typeof window === 'undefined' ? null : window.turnstile;

        if (!turnstile || !containerRef.current || widgetIdRef.current) {
          return false;
        }

        widgetIdRef.current = turnstile.render(containerRef.current, {
          action,
          callback(token) {
            onTokenChange(token);
          },
          'error-callback'() {
            onTokenChange(null);
          },
          'expired-callback'() {
            onTokenChange(null);
          },
          sitekey: siteKey,
          theme,
        });

        return true;
      };

      if (!renderWidget()) {
        intervalId = window.setInterval(() => {
          if (isDisposed) {
            return;
          }

          if (renderWidget() && intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
          }
        }, RENDER_POLL_INTERVAL_MS);
      }

      return () => {
        isDisposed = true;

        if (intervalId !== null) {
          window.clearInterval(intervalId);
        }

        clearWidget();
      };
    }, [action, onTokenChange, siteKey, theme]);

    if (!siteKey) {
      return null;
    }

    return <div ref={containerRef} className={className} />;
  },
);

Turnstile.displayName = 'Turnstile';
