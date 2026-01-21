import { defineRecipe } from '@chakra-ui/react';

export const textRecipe = defineRecipe({
  variants: {
    sizes: {
      'heading-1': {
        fontSize: '4.5rem',
        lineHeight: '5.625rem',
        letterSpacing: '-2%',
      },
      'heading-2': {
        fontSize: '3.75rem',
        lineHeight: '4.5rem',
        letterSpacing: '-2%',
      },
      'heading-3': {
        fontSize: '3rem',
        lineHeight: '3.75rem',
        letterSpacing: '-2%',
      },
      'heading-4': {
        fontSize: '2.25rem',
        lineHeight: '2.75rem',
        letterSpacing: '-2%',
      },
      'heading-5': {
        fontSize: '1.875rem',
        lineHeight: '2.375rem',
      },
      'heading-6': {
        fontSize: '1. 5rem',
        lineHeight: '2rem',
      },
      'paragraph-xl': {
        fontSize: '1.25rem',
        lineHeight: '1.875rem',
      },
      'paragraph-lg': {
        fontSize: '1.125rem',
        lineHeight: '1.75rem',
      },
      'paragraph-md': {
        fontSize: '1rem',
        lineHeight: '1.5rem',
      },
      'paragraph-sm': {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
      },
      'paragraph-xs': {
        fontSize: '0.75rem',
        lineHeight: '1.125rem',
      },
    },
  },
  defaultVariants: {
    sizes: 'paragraph-md',
  },
});
