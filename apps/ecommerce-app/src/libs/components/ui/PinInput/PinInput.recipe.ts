import { pinInputAnatomy } from '@ark-ui/react/pin-input';
import { tv } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '~/utils/anatomyToRecipeSlots';

export const pinInputRecipe = tv({
  slots: anatomyToRecipeSlots(pinInputAnatomy, {
    label:
      'mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#101828] dark:text-fg-secondary-700',
    control: 'grid grid-cols-6 gap-md',
    input: [
      'w-full',
      'aspect-square',
      'rounded-lg',
      'text-4xl',
      'font-semibold',
      'text-center',
      'border',
      'border-[#EAECF0]',
      'bg-white',
      'outline-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-60',

      'ui-invalid:border-[#D92D20]',
      'ui-readonly:cursor-default',
      'ui-readonly:opacity-60',
      'placeholder:text-[#667085]',

      'dark:border-[#26272B]',
      'dark:bg-[#0A1117]',
      'dark:placeholder:text-[#85888E]',
      'dark:ui-invalid:border-[#D92D20]',

      'inplay:border-[#26272B]',
      'inplay:bg-[#0A1117]',
      'inplay:placeholder:text-[#85888E]',
      'inplay:ui-invalid:border-[#D92D20]',
    ],
  }),
});
