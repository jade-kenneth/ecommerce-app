import { dialogAnatomy } from '@ark-ui/react/dialog';
import { tv } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '~/utils/anatomyToRecipeSlots';

const anatomy = dialogAnatomy.extendWith('header', 'body', 'footer');

export const dialogRecipe = tv({
  slots: anatomyToRecipeSlots(anatomy, {
    backdrop:
      'fixed inset-0 z-dropdown bg-white/90 backdrop-blur-sm ui-open:animate-backdrop-in ui-closed:animate-backdrop-out',
    positioner: 'fixed inset-0 z-dialog overflow-y-auto px-8 py-16',
    content: [
      'z-dia',
      'relative',
      'mx-auto',
      'max-w-[640px]',
      'min-w-[640px]',
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
    header:
      'relative flex gap-6 border-[#EAECF0] p-6 pr-12 pb-5 dark:border-[#26272B] inplay:border-[#26272B]',
    body: 'relative p-6 pt-5',
    footer:
      'relative flex justify-end gap-3 border-t border-[#EAECF0] p-6 dark:border-[#26272B] inplay:border-[#26272B]',
    title:
      'text-lg font-semibold text-[#101828] dark:text-[#F5F5F6] inplay:text-[#F5F5F6]',
    description:
      'mt-1 text-sm text-[#475467] dark:text-[#94969C] inplay:text-[#94969C]',
    closeTrigger:
      'absolute top-3 right-3 z-1 flex size-11 items-center justify-center icon:size-6 icon:text-[#98A2B3] dark:icon:text-[#85888E] inplay:icon:text-[#85888E]',
  }),
});
