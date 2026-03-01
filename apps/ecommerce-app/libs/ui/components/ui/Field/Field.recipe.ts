import { fieldAnatomy } from '@ark-ui/react/field';
import { anatomyToRecipeSlots } from '~/utils/anatomyToRecipeSlots';
import { tv } from 'tailwind-variants';

export const fieldRecipe = tv({
  slots: anatomyToRecipeSlots(fieldAnatomy, {
    input: [
      'block',
      'w-full',
      'rounded-lg',
      'border',
      'border-[#EAECF0]',
      'bg-white',
      'outline-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-60',
      'ui-invalid:border-[#D92D20]',
      'placeholder:text-[#667085]',

      'dark:border-[#26272B]',
      'dark:bg-[#0A1117]',
      'dark:placeholder:text-[#85888E]',
    ],
    select: [
      'block',
      'w-full',
      'rounded-lg',
      'border',
      'border-[#EAECF0]',
      'bg-white',
      'outline-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-60',
      'ui-invalid:border-[#D92D20]',
      'placeholder:text-[#667085]',

      'dark:border-[#26272B]',
      'dark:bg-[#0A1117]',
      'dark:placeholder:text-[#85888E]',
    ],
    textarea: [
      'block',
      'w-full',
      'rounded-lg',
      'border',
      'border-[#EAECF0]',
      'bg-white',
      'outline-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-60',
      'ui-invalid:border-[#D92D20]',
      'placeholder:text-[#667085]',

      'dark:border-[#26272B]',
      'dark:bg-[#0A1117]',
      'dark:placeholder:text-[#85888E]',

      'scrollbar:w-2',
      'scrollbar-track:bg-transparent',
      'scrollbar-thumb:rounded-full',
      'scrollbar-thumb:bg-[#EAECF0]',
      'dark:scrollbar-thumb:bg-[#333333]',
    ],
    label:
      'mb-1.5 flex items-center gap-1.5 text-sm font-medium text-fg-secondary-700 light:text-[#101828]',
    helperText: 'mt-1.5 text-sm leading-none opacity-60',
    requiredIndicator: 'text-sm text-[#CECFD2]',
    errorText:
      'mt-1.5 text-sm leading-none text-fg-error-primary-600 light:text-[#D92D20]',
  }),
  variants: {
    size: {
      '2xs': {
        input: 'h-8 px-2.5 text-sm',
        select: 'h-8 px-2.5 text-sm',
        textarea: 'p-2.5 text-sm',
      },
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
