import { toastAnatomy } from '@ark-ui/react';

import { tv } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '../../utils';

export const toastRecipe = tv({
  slots: anatomyToRecipeSlots(toastAnatomy, {
    root: [
      'group z-[var(--z-index)] flex h-[var(--height)] min-w-full scale-[var(--scale)] items-center gap-xl rounded-xl border border-[#EAECF0] bg-white p-xl opacity-[var(--opacity)] transition-all duration-300 [translate:var(--x)_var(--y)_0] dark:border-[#26272B] dark:bg-[#161B26]',
    ],
    title: 'sr-only',
    description:
      'grow text-sm font-semibold text-[#475467] dark:text-[#CECFD2]',
    closeTrigger:
      'flex shrink-0 items-center text-[#475467] dark:text-[#CECFD2] [&_svg]:size-5',
  }),
});
