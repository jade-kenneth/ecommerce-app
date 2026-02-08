import { popoverAnatomy } from '@ark-ui/react/popover';
import { tv } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '~/utils/anatomyToRecipeSlots';

export const popoverRecipe = tv({
  slots: anatomyToRecipeSlots(popoverAnatomy, {
    content: [
      'max-h-(--available-height)',
      'z-popover',
      'rounded-lg',
      'border',
      'border-[#EAECF0]',
      'bg-white',
      'p-3',
      'text-xs',
      'font-medium',
      'dark:border-0',
      'dark:bg-[#161B26]',
      'dark:text-[#D6D6D6]',

      'ui-placement-bottom:ui-open:animate-popover-in-bottom',
      'ui-placement-bottom-start:ui-open:animate-popover-in-bottom',
      'ui-placement-bottom-end:ui-open:animate-popover-in-bottom',
      'ui-placement-bottom:ui-closed:animate-popover-out-bottom',
      'ui-placement-bottom-start:ui-closed:animate-popover-out-bottom',
      'ui-placement-bottom-end:ui-closed:animate-popover-out-bottom',

      'ui-placement-top:ui-open:animate-popover-in-top',
      'ui-placement-top-start:ui-open:animate-popover-in-top',
      'ui-placement-top-end:ui-open:animate-popover-in-top',
      'ui-placement-top:ui-closed:animate-popover-out-top',
      'ui-placement-top-start:ui-closed:animate-popover-out-top',
      'ui-placement-top-end:ui-closed:animate-popover-out-top',

      'ui-placement-left:ui-open:animate-popover-in-left',
      'ui-placement-left-start:ui-open:animate-popover-in-left',
      'ui-placement-left-end:ui-open:animate-popover-in-left',
      'ui-placement-left:ui-closed:animate-popover-out-left',
      'ui-placement-left-start:ui-closed:animate-popover-out-left',
      'ui-placement-left-end:ui-closed:animate-popover-out-left',

      'ui-placement-right:ui-open:animate-popover-in-right',
      'ui-placement-right-start:ui-open:animate-popover-in-right',
      'ui-placement-right-end:ui-open:animate-popover-in-right',
      'ui-placement-right:ui-closed:animate-popover-out-right',
      'ui-placement-right-start:ui-closed:animate-popover-out-right',
      'ui-placement-right-end:ui-closed:animate-popover-out-right',

      'scrollbar:w-2',
      'scrollbar-track:bg-transparent',
      'scrollbar-thumb:rounded-full',
      'scrollbar-thumb:bg-[#EAECF0]',
      'dark:scrollbar-thumb:bg-[#333333]',
    ],
    indicator:
      'size-5 shrink-0 transition-transform duration-300 ui-open:rotate-180',
    arrow: 'arrow-bg-[#161B26] arrow-size-[14px]',
  }),
  defaultVariants: {
    variant: 'default',
  },
});
