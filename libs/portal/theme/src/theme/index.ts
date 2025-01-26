import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { recipes } from './recipes';
import { tokens } from './tokens';

export const customConfig = defineConfig({
  theme: {
    recipes,
    tokens,
  },
});

export const system = createSystem(defaultConfig, customConfig);
