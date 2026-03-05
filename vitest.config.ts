import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromRoot = (relativePath: string) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

const appLibsRoot = fromRoot('./apps/ecommerce-app/libs');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~\/admin$/,
        replacement: fromRoot(
          './apps/ecommerce-app/libs/features/src/admin/index.ts',
        ),
      },
      {
        find: /^~\/admin\/(.*)$/,
        replacement: `${appLibsRoot}/features/src/admin/$1`,
      },

      {
        find: /^~\/components$/,
        replacement: fromRoot('./apps/ecommerce-app/libs/components/index.ts'),
      },
      {
        find: /^~\/components\/(.*)$/,
        replacement: `${appLibsRoot}/components/$1`,
      },

      {
        find: /^~\/constants$/,
        replacement: fromRoot('./apps/ecommerce-app/libs/utils/constant.ts'),
      },

      {
        find: /^~\/config$/,
        replacement: fromRoot('./apps/ecommerce-app/libs/config/src/index.ts'),
      },
      {
        find: /^~\/config\/(.*)$/,
        replacement: `${appLibsRoot}/config/src/$1`,
      },

      {
        find: /^~\/providers$/,
        replacement: fromRoot(
          './apps/ecommerce-app/libs/providers/src/index.ts',
        ),
      },
      {
        find: /^~\/providers\/(.*)$/,
        replacement: `${appLibsRoot}/providers/src/$1`,
      },

      {
        find: /^~\/features\/(.*)$/,
        replacement: `${appLibsRoot}/features/src/$1`,
      },
      {
        find: /^~\/graphql\/(.*)$/,
        replacement: `${appLibsRoot}/graphql/src/$1`,
      },

      {
        find: /^~\/theme$/,
        replacement: fromRoot('./apps/ecommerce-app/libs/theme/src/index.ts'),
      },
      { find: /^~\/theme\/(.*)$/, replacement: `${appLibsRoot}/theme/src/$1` },

      {
        find: /^~\/utils$/,
        replacement: fromRoot('./apps/ecommerce-app/libs/utils/index.ts'),
      },
      { find: /^~\/utils\/(.*)$/, replacement: `${appLibsRoot}/utils/$1` },

      {
        find: /^~\/icons$/,
        replacement: fromRoot(
          './apps/ecommerce-app/libs/components/icons/index.ts',
        ),
      },
      { find: /^~\/icons\/(.*)$/, replacement: `${appLibsRoot}/components/icons/$1` },

      { find: /^~\/hooks\/(.*)$/, replacement: `${appLibsRoot}/hooks/$1` },

      {
        find: /^~\/store$/,
        replacement: fromRoot(
          './apps/ecommerce-app/libs/data-access/src/store/store.ts',
        ),
      },
    ],
  },

  test: {
    globals: true,
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'ecommerce-app',
          include: ['apps/ecommerce-app/**/*.{test,spec}.ts?(x)'],
          environment: 'jsdom',
        },
      },
      {
        extends: true,
        test: {
          name: 'ecommerce-server',
          include: ['apps/ecommerce-server/**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
    ],
  },
});
