import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { recipes } from './recipes';

export const customConfig = defineConfig({
  theme: {
    recipes,
    tokens: {
      sizes: {},
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
