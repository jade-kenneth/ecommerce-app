'use client';
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { recipes } from './recipes';
import { tokens } from './tokens';

export * from './recipes';
export * from './tokens';
// const palette = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

// const colorObj = Object.entries(
//   colors.colors as Record<string, Record<number, { value: string }>>
// )
//   .map(([key, value]) => {
//     return ['fg']
//       .map((variant) => {
//         return palette.map((d, idx) => {
//           return {
//             [`"${[key]}.${[variant]}.${[palette[idx]]}"`]: {
//               [variant]: { value: value?.[palette[idx]]?.value },
//             },
//           };
//         });
//       })
//       .flatMap((color) => color);
//   })
//   .flatMap((color) => color);

// const result = Object.assign({}, ...colorObj.map((obj) => obj));

export const customConfig = defineConfig({
  theme: {
    recipes,
    tokens,
    // semanticTokens: {
    //   colors: result,
    // },
  },
  conditions: {
    variant: '&is:([variant=solid])',
    off: '&:is([data-state=off])',
    on: '&:is([data-state=on])',
  },
});

export const system = createSystem(defaultConfig, customConfig);
