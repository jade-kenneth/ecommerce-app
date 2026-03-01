import { paginationAnatomy } from '@ark-ui/anatomy';
import { anatomyToRecipeSlots } from '~/utils';
import { tv } from 'tailwind-variants';

export const paginationRecipe = tv({
  slots: anatomyToRecipeSlots(paginationAnatomy, {
    root: 'flex justify-between items-center w-full py-3  bg-white dark:bg-[#0A1117] dark:border-[#26272B]',
    prevTrigger:
      'px-3 py-2 ml-2 text-sm font-medium border-[1px] rounded-lg border-[#D0D5DD] text-carbon-100 flex items-center gap-1 cursor-pointer',
    nextTrigger:
      'px-3 py-2  mr-2 text-sm font-medium border-[1px] rounded-lg border-[#D0D5DD] text-carbon-100 flex items-center gap-1 cursor-pointer',
  }),
});
