import { buttonRecipe } from './button';
import { textRecipe } from './text';

export { buttonRecipe, textRecipe };
export const recipes = {
  text: textRecipe,
  button: buttonRecipe(),
};
