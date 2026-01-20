'use client';
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { recipes } from './recipes';
import { tokens } from './tokens';
export * from './recipes';
export * from './tokens';

export const customConfig = defineConfig({
  globalCss: {
    '.max-w-screen': {
      maxWidth: '1440px',
      mx: 'auto',
      w: 'full',
      px: '5rem',
    },
    '.custom-swiper .swiper-pagination-bullet': {
      width: '12px!important',
      height: '12px!important',
      opacity: '0.7',
      transition: 'transform 0.3s ease!important',
    },

    /* Customize active bullet styles */
    '.custom-swiper .swiper-pagination-bullet-active': {
      bgColor: 'white!important',
      width: '36px!important',
      height: '12px!important',
      borderRadius: '10.5px!important',
    },
    '&[data-selected="true"]': {
      bg: 'colors.primary.900',
      color: 'colors.primary.100',

      boxShadow: '0 0 0 4px rgba(147, 215, 215, 1)',
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
