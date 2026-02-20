import { toggleAnatomy } from '@ark-ui/react/toggle';
import { tv } from 'tailwind-variants';
import { anatomyToRecipeSlots } from '~/utils/anatomyToRecipeSlots';

export const toggleRecipe = tv({
  slots: anatomyToRecipeSlots(toggleAnatomy),
});
