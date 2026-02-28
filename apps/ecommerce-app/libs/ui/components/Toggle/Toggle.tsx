import { Toggle } from '@ark-ui/react/toggle';
import { createRecipeContext } from 'libs/utils/createRecipeContext';
import { toggleRecipe } from './Toggle.recipe';

const { withProvider, withContext } = createRecipeContext(toggleRecipe);

export const Root = withProvider(Toggle.Root, 'root');
export const Indicator = withContext(Toggle.Indicator, 'indicator');
export const Context = Toggle.Context;
