import { menuAnatomy } from '@ark-ui/react';

import { anatomyToRecipeSlots } from '~/utils';
import { tv } from 'tailwind-variants';

export const menuRecipe = tv({
  slots: anatomyToRecipeSlots(menuAnatomy, {
    content:
      'z-dropdown min-w-[215px] rounded-lg border border-[#EAECF0] bg-white p-2 dark:border-[#26272B] dark:bg-[#0A1117] outline-none',
    item: 'flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-[#344054] transition-colors duration-200 ui-disabled:cursor-not-allowed ui-disabled:opacity-65 ui-highlighted:bg-[#F9FAFB] dark:text-[#CECFD2] dark:ui-highlighted:bg-[#1F242F] [&_svg]:size-4 [&_svg]:text-[#667085] dark:[&_svg]:text-[#94969C]',
    separator:
      'my-2 border-t border-[#EAECF0] opacity-60 dark:border-[#26272B]',
    indicator: 'transition-transform duration-200 ui-open:rotate-180',
    trigger: 'hover:cursor-pointer outline-none w-full',
  }),
});
