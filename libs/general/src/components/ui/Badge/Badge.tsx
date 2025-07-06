import { ark } from '@ark-ui/react';
import { createRecipeContext } from '@utils';
import { badgeRecipe } from './Badge.recipe';

const { withProvider, withContext } = createRecipeContext(badgeRecipe);

export const Root = withProvider(ark.div, 'root');

export const Indicator = withContext(ark.span, 'indicator');
export const Label = withContext(ark.span, 'label');
