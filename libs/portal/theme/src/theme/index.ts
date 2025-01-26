'use client';
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { recipes } from './recipes';
import { tokens } from './tokens';

export * from './recipes';
export * from './tokens';

export const customConfig = defineConfig({
  globalCss: {
    '.max-w-screen': {
      maxWidth: '1280px',
      mx: 'auto',
    },
  },
  theme: {
    recipes,
    tokens,
    breakpoints: {
      wide: '1400px',
      tablet: '992px',
      desktop: '1280px',
    },
  },
  conditions: {
    off: '&:is([data-state=off])',
    on: '&:is([data-state=on])',
  },
});

export const system = createSystem(defaultConfig, customConfig);
