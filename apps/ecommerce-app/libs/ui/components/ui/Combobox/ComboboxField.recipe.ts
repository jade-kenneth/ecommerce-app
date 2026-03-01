import { comboboxAnatomy } from '@ark-ui/react';

import { anatomyToRecipeSlots } from '~/utils';
import { tv } from 'tailwind-variants';

export const comboboxRecipe = tv({
  slots: anatomyToRecipeSlots(comboboxAnatomy, {
    label:
      'mb-1.5 flex items-center gap-0.5 text-sm font-bold text-carbon-100 dark:text-[#F5F5F6]',
    control:
      'flex w-full items-center rounded-[32px] border border-[#EAECF0] bg-white ui-invalid:border-[#D92D20] dark:border-[#26272B] dark:bg-[#0A1117]',
    input:
      'grow bg-transparent outline-none placeholder:text-[#667085] dark:placeholder:text-[#85888E]',
    trigger: [
      'flex shrink-0 items-center justify-center',
      '[&_svg]:size-5 [&_svg]:text-[#667085]  [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ui-open:rotate-180 [&_svg]:ui-closed:rotate-0 dark:[&_svg]:text-[#94969C]',
    ],
    clearTrigger: '[&_svg]:size-5 [&_svg]:text-[#94969C]',
    content: [
      'p-1',
      'border',
      'border-[#EAECF0]',
      'bg-white',
      'dark:bg-[#0A1117]',
      'dark:border-[#26272B]',
      'rounded-lg',
      'max-h-[410px]',
      'overflow-y-auto',
      'z-dropdown',
      'ui-open:animate-fade-in',
      'ui-closed:animate-fade-out',
      '[&::-webkit-scrollbar]:w-2',
      '[&::-webkit-scrollbar-track]:bg-transparent',
      '[&::-webkit-scrollbar-thumb]:rounded-full',
      '[&::-webkit-scrollbar-thumb]:bg-[#EAECF0]',
      'dark:[&::-webkit-scrollbar-thumb]:bg-[#333333]',
    ],
    item: 'flex cursor-pointer items-center gap-2 rounded-md p-2.5 transition-colors duration-200 ui-disabled:cursor-not-allowed ui-disabled:opacity-75 ui-highlighted:bg-[#F9FAFB] dark:ui-highlighted:bg-[#1F242F]',
    itemText: 'grow',
    itemIndicator: 'flex size-5 text-[#C99723] ',
  }),
  variants: {
    size: {
      xs: {
        input: 'h-9 px-3 text-sm',
        trigger: 'size-9',
      },
      sm: {
        input: 'h-10 px-3.5 text-sm',
        trigger: 'size-10',
      },
      md: {
        input: 'h-11 px-4 text-base',
        trigger: 'size-11',
      },
      lg: {
        input: 'h-12 px-4.5',
        trigger: 'size-12',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
