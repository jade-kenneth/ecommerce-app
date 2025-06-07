import { numberInputAnatomy } from '@ark-ui/anatomy';
import { anatomyToRecipeSlots } from '@utils';
import { tv } from 'tailwind-variants';

export const numberInputRecipe = tv({
  slots: anatomyToRecipeSlots(numberInputAnatomy, {
    control:
      'grid grid-cols-[1fr_32px] rounded-[32px] grid-rows-[1fr_1fr] overflow-hidden border border-[#EAECF0] bg-white ui-invalid:border-[#D92D20] ui-readonly:cursor-default ui-readonly:opacity-60 dark:border-[#26272B] dark:bg-[#0A1117] dark:ui-invalid:border-[#D92D20]',
    input:
      'rounded-[32px] border-[1px] border-[#EAEAEA] outline-none placeholder:text-carbon-700-value py-3 px-4 ui-invalid:border-[#D92D20]',
    label:
      'mb-1.5 flex items-center gap-1.5 text-carbon-100-value text-sm font-bold dark:text-[#F5F5F6]',
    decrementTrigger:
      'inline-flex cursor-pointer items-center justify-center border-l border-t border-[#EAECF0] ui-disabled:cursor-not-allowed dark:border-[#26272B]',
    incrementTrigger:
      'inline-flex cursor-pointer items-center justify-center border-l border-[#EAECF0] ui-disabled:cursor-not-allowed dark:border-[#26272B]',
  }),
  variants: {
    size: {
      xs: {
        control: 'h-9 pl-3 text-sm',
        incrementTrigger: '[&_svg]:size-4',
        decrementTrigger: '[&_svg]:size-4',
      },
      sm: {
        control: 'h-10 pl-3.5 text-sm',
        incrementTrigger: '[&_svg]:size-4',
        decrementTrigger: '[&_svg]:size-4',
      },
      md: {
        control: 'h-11 pl-4 text-base',
        incrementTrigger: '[&_svg]:size-5',
        decrementTrigger: '[&_svg]:size-5',
      },
      lg: {
        control: 'h-12 pl-4.5 text-base',
        incrementTrigger: '[&_svg]:size-5',
        decrementTrigger: '[&_svg]:size-5',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
