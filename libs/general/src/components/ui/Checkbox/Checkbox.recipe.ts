import { checkboxAnatomy } from '@ark-ui/react';
import { anatomyToRecipeSlots } from '@utils';
import { tv } from 'tailwind-variants';

export const checkboxRecipe = tv({
  slots: anatomyToRecipeSlots(checkboxAnatomy, {
    root: 'flex items-center',
    control: 'flex shrink-0 items-center justify-center',
    label: 'font-medium',
  }),
  variants: {
    size: {
      sm: {
        root: 'gap-2',
        control: 'size-4 rounded-[4px]',
        indicator: 'size-3.5',
        label: 'text-sm',
      },
      md: {
        root: 'gap-3',
        control: 'size-5 rounded-md',
        indicator: 'size-4',
        label: 'text-base',
      },
    },
    variant: {
      solid: {
        control:
          'border border-[#D0D5DD] ui-checked:border-primary-700-value ui-checked:bg-primary-700-value dark:border-[#3F3F46]',
        indicator: 'text-primary-400-value',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },
});
