import { tabsAnatomy } from '@ark-ui/react/tabs';
import { tv } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '~/utils/anatomyToRecipeSlots';

export const tabsRecipe = tv({
  slots: anatomyToRecipeSlots(tabsAnatomy, {
    list: 'relative',
    trigger: 'relative',
    indicator: 'h-(--height) w-(--width)',
  }),
  variants: {
    variant: {
      unstyled: {},
      outline: {
        list: 'flex gap-2 border-b border-[#EAECF0] dark:border-[#26272B]',
        indicator: '-bottom-px h-0.5 bg-brand inplay:bg-brand-inplay',
        trigger:
          'px-2 pb-2 font-medium ui-selected:text-brand ui-selected:inplay:text-brand-inplay',
      },
      enclosed: {
        list: [
          'p-1',
          'flex',
          'items-center',
          'gap-md',
          'rounded-lg',
          'border',
          'border-[#EAECF0]',
          'bg-[#F9FAFB]',
          'dark:border-[#26272B]',
          'dark:bg-[#0A1117]',
          'scrollbar:h-1.5',
          'scrollbar-track:bg-transparent',
          'scrollbar-thumb:rounded-full',
          'scrollbar-thumb:bg-[#EAECF0]',
          'dark:scrollbar-thumb:bg-[#333333]',
        ],
        trigger:
          'relative z-1 flex h-full items-center justify-center px-3 font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#94969C] ui-disabled:cursor-not-allowed ui-disabled:opacity-60 ui-selected:text-[#344054] dark:ui-selected:text-[#CECFD2]',
        indicator: 'rounded-md bg-white shadow-sm dark:bg-[#161B26]',
      },
    },
    size: {
      sm: {},
      md: {},
    },
  },
  compoundVariants: [
    {
      variant: 'enclosed',
      size: 'sm',
      className: {
        list: 'h-11',
        trigger: 'text-sm',
      },
    },
    {
      variant: 'enclosed',
      size: 'md',
      className: {
        list: 'h-12',
        trigger: 'text-base',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    variant: 'enclosed',
  },
});
