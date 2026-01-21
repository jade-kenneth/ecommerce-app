import { createAnatomy } from '@ark-ui/anatomy';

import { tv, VariantProps } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '../../../utils';

const anatomy = createAnatomy('badge').parts('root', 'label', 'indicator');

export const badgeRecipe = tv(
  {
    slots: anatomyToRecipeSlots(anatomy),
    variants: {
      variant: {
        subtle: {
          root: 'inline-flex items-center gap-1 rounded-full border font-medium',
          indicator: 'size-3.5',
        },
      },
      size: {
        sm: {
          root: 'px-2 py-0.5 text-xs',
        },
        md: {
          root: 'px-2.5 py-0.5 text-sm',
        },
      },
      colorScheme: {
        gray: {},
        info: {},
        danger: {},
        warning: {},
        success: {},
        black: {},
      },
    },
    compoundVariants: [
      {
        variant: 'subtle',
        colorScheme: 'info',
        className: {
          root: 'border border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2] dark:border-[#065986] dark:bg-[#062C4199] dark:text-[#7CD4FD]',
          indicator: 'text-[#0EA5E9]',
        },
      },
      {
        variant: 'subtle',
        colorScheme: 'success',
        className: {
          root: 'border border-[#ABEFC6] bg-[#ECFDF3] text-[#067647] dark:border-[#085D3A] dark:bg-[#053321] dark:text-[#75E0A7]',
          indicator: 'text-[#17B26A]',
        },
      },
      {
        variant: 'subtle',
        colorScheme: 'danger',
        className: {
          root: 'border border-[#FECDCA] bg-[#FEF3F2] text-[#B42318] dark:border-[#912018] dark:bg-[#55160C] dark:text-[#FDA29B]',
          indicator: 'text-[#F04438]',
        },
      },
      {
        variant: 'subtle',
        colorScheme: 'warning',
        className: {
          root: 'border border-[#FEDF89] bg-[#FFFAEB] text-[#B54708] dark:border-[#93370D] dark:bg-[#4E1D09] dark:text-[#FEC84B]',
          indicator: 'text-[#FBBF24]',
        },
      },
      {
        variant: 'subtle',
        colorScheme: 'gray',
        className: {
          root: 'border border-[#EAECF0] bg-white dark:border-[#333741] dark:bg-[#161B26] dark:text-[#CECFD2]',
          indicator: 'text-[#CECFD2]',
        },
      },
      {
        variant: 'subtle',
        colorScheme: 'black',
        className: {
          root: 'rounded-[6px] border-[1px] border-solid bg-white dark:border-[#3F3F46] dark:bg-[#0A1117] dark:text-[#FDB022]',
          indicator: 'text-[#CECFD2]',
        },
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'subtle',
      colorScheme: 'gray',
    },
  },
  {
    twMerge: true,
  }
);

export type BadgeRecipeProps = VariantProps<typeof badgeRecipe>;
