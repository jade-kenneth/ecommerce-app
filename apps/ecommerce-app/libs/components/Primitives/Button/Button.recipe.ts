import { createAnatomy } from '@ark-ui/anatomy';
import { anatomyToRecipeSlots } from '~/utils';
import { tv, VariantProps } from 'tailwind-variants';

const anatomy = createAnatomy('button').parts('root');

export const buttonRecipe = tv(
  {
    slots: anatomyToRecipeSlots(anatomy, {
      root: 'bg-cyan-700 hover:bg-cyan-600 text-white cursor-pointer focus:ring-4 focus:ring-opacity-50 disabled:opacity-60 inline-flex items-center justify-center font-medium transition-colors duration-200 ease-in-out',
    }),

    variants: {
      size: {
        '2xl': {
          root: 'px-6 py-4 text-xl rounded-[32px]',
        },
        lg: {
          root: 'px-5 py-3.5 text-lg rounded-xl',
        },
        md: {
          root: 'px-4 py-3 text-base rounded-lg',
        },
        sm: {
          root: 'px-3 py-2 text-sm rounded-md',
        },
        xs: {
          root: 'px-2 py-1 text-xs rounded',
        },
      },
      variant: {
        solid: {
          root: 'text-white',
        },
        outline: {
          root: 'bg-white border',
        },
        ghost: {
          root: 'bg-transparent hover:bg-transparent disabled:opacity-60',
        },
      },
      colorScheme: {
        primary: {},
        secondary: {},
        danger: {},
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        colorScheme: 'primary',
        className: {
          root: 'bg-[color:var(--btn-bg)] hover:bg-[color:var(--btn-bg-hover)] disabled:bg-[color:var(--btn-bg-disabled)] focus:ring-[color:var(--btn-focus)]',
        },
      },
      {
        variant: 'outline',
        colorScheme: 'primary',
        className: {
          root: 'border-[color:var(--btn-border)] text-[color:var(--btn-text)] hover:bg-[color:var(--btn-bg-hover)] disabled:opacity-60 focus:ring-[color:var(--btn-focus)]',
        },
      },
      {
        variant: 'ghost',
        colorScheme: 'primary',
        className: {
          root: 'text-[color:var(--btn-text)] focus:ring-[color:var(--btn-focus)]',
        },
      },
    ],
    defaultVariants: {
      size: 'lg',
      colorScheme: 'primary',
    },
  },
  {
    twMerge: true,
  },
);

export type ButtonRecipeProps = VariantProps<typeof buttonRecipe>;
