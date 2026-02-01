import { dialogAnatomy } from '@ark-ui/react/dialog';
import { tv } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '~/utils/anatomyToRecipeSlots';

const anatomy = dialogAnatomy
  .rename('alert-dialog')
  .extendWith('header', 'footer', 'body');

export const alertDialogRecipe = tv({
  slots: anatomyToRecipeSlots(anatomy, {
    positioner: 'fixed inset-0 z-dialog flex items-center justify-center p-8',
    content: [
      'z-dialog',
      'relative',
      'min-w-[520px]',
      'max-w-[520px]',
      'rounded-xl',
      'bg-white',
      'dark:border',
      'dark:border-[#26272B]',
      'dark:bg-[#0A1117]',
      'inplay:border',
      'inplay:border-[#26272B]',
      'inplay:bg-[#0A1117]',
      'ui-open:animate-dialog-in',
      'ui-closed:animate-dialog-out',
    ],
    backdrop:
      'fixed inset-0 z-backdrop bg-[#0000004D] backdrop-blur-xs ui-open:animate-backdrop-in ui-closed:animate-backdrop-out',
    title:
      'text-lg font-semibold text-[#101828] dark:text-[#F5F5F6] inplay:text-[#F5F5F6]',
    description:
      'mt-1 text-sm text-[#475467] dark:text-[#94969C] inplay:text-[#94969C]',
    closeTrigger:
      'absolute top-3 right-3 flex size-11 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 ui-disabled:cursor-not-allowed ui-disabled:opacity-50 icon:size-6 icon:text-[#98A2B3] dark:icon:text-[#85888E] inplay:icon:text-[#85888E]',
    header: 'flex gap-6 p-6 pr-12 pb-8',
    body: 'p-6 pt-5',
    footer:
      'flex justify-end gap-3 border-t border-[#EAECF0] p-6 dark:border-[#26272B] inplay:border-[#26272B]',
  }),
});
