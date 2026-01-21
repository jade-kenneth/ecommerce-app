import { fieldAnatomy } from '@ark-ui/react';

import { tv } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '../../../utils';

export const fieldRecipe = tv({
  slots: anatomyToRecipeSlots(fieldAnatomy, {
    input:
      'rounded-[32px] border-[1px] border-[#EAEAEA] outline-none placeholder:text-carbon-700-value py-2 px-3 ui-invalid:border-[#D92D20] ui-readonly:cursor-default ui-readonly:opacity-60 dark:border-[#26272B] dark:bg-[#0A1117] dark:placeholder:text-[#85888E] dark:ui-invalid:border-[#D92D20]',
    select:
      'block w-full rounded-lg border border-[#EAECF0] bg-white outline-none placeholder:text-[#667085] ui-invalid:border-[#D92D20] ui-readonly:cursor-default ui-readonly:opacity-60 dark:border-[#26272B] dark:bg-[#0A1117] dark:placeholder:text-[#85888E] dark:ui-invalid:border-[#D92D20]',
    textarea:
      'block w-full rounded-lg border border-[#EAECF0] bg-white outline-none placeholder:text-[#667085] ui-invalid:border-[#D92D20] ui-readonly:cursor-default ui-readonly:opacity-60 dark:border-[#26272B] dark:bg-[#0A1117] dark:placeholder:text-[#85888E] dark:ui-invalid:border-[#D92D20]',
    label:
      'mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#101828] dark:text-[#F5F5F6]',
    helperText: 'mt-1.5 text-sm leading-none opacity-60',
    requiredIndicator: 'text-sm text-[#CECFD2]',
    errorText: 'mt-1.5 text-sm leading-none text-[#D92D20]',
  }),
  variants: {
    size: {
      xs: {
        input: 'h-9 px-3 text-sm',
        select: 'h-9 px-3 text-sm',
        textarea: 'p-3 text-sm',
      },
      sm: {
        input: 'h-10 px-3.5 text-sm',
        select: 'h-10 px-3.5 text-sm',
        textarea: 'p-3.5 text-sm',
      },
      md: {
        input: 'h-11 px-4 text-base',
        select: 'h-11 px-4 text-base',
        textarea: 'p-4 text-base',
      },
      lg: {
        input: 'h-12 px-4.5 text-base',
        select: 'h-12 px-4.5 text-base',
        textarea: 'p-4.5 text-base',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
