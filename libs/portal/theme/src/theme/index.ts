'use client';
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { recipes } from './recipes';
import { tokens } from './tokens';

export * from './recipes';
export * from './tokens';

export const customConfig = defineConfig({
  theme: {
    recipes,
    tokens,
  },
  conditions: {
    off: '&:is([data-state=off])',
    on: '&:is([data-state=on])',
  },
});

export const system = createSystem(defaultConfig, customConfig);
