import { fieldAnatomy } from '@ark-ui/anatomy';
import { anatomyToRecipeSlots } from '@utils';
import { tv } from 'tailwind-variants';

export const fieldInputRecipe = tv({
  slots: anatomyToRecipeSlots(fieldAnatomy, {
    root: 'flex flex-col gap-1.5',
    label: 'text-carbon-100-value text-sm font-bold',
    textarea: '',
    input:
      'rounded-[32px] border-[1px] border-[#EAEAEA] outline-none placeholder:text-carbon-700-value py-2 px-3 ui-invalid:border-[#D92D20]',
  }),
  variants: {
    size: {
      xs: {
        input: 'h-9 text-sm',
      },
      sm: {
        input: 'h-10 text-sm',
      },
      md: {
        input: 'h-11 text-base',
      },
      lg: {
        input: 'h-12',
      },
    },
  },
  defaultVariants: { size: 'md' },
});
