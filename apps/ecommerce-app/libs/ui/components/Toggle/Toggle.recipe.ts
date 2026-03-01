import { toggleAnatomy } from '@ark-ui/react/toggle';
import { anatomyToRecipeSlots } from '~/utils/anatomyToRecipeSlots';
import { tv } from 'tailwind-variants';

export const toggleRecipe = tv({
  slots: anatomyToRecipeSlots(toggleAnatomy),
});
