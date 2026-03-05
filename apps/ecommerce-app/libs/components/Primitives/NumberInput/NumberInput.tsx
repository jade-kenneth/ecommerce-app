import { NumberInput } from '@ark-ui/react';

import { createRecipeContext } from '~/utils';
import { numberInputRecipe } from './NumberInput.recipe';

const { withContext, withProvider, withRootProvider } =
  createRecipeContext(numberInputRecipe);

export const Root = withProvider(NumberInput.Root, 'root');
export const RootProvider = withRootProvider(NumberInput.RootProvider);
export const Control = withContext(NumberInput.Control, 'control');
export const DecrementTrigger = withContext(
  NumberInput.DecrementTrigger,
  'decrementTrigger',
);
export const IncrementTrigger = withContext(
  NumberInput.IncrementTrigger,
  'incrementTrigger',
);
export const Input = withContext(NumberInput.Input, 'input');
export const Label = withContext(NumberInput.Label, 'label');
export const Scrubber = withContext(NumberInput.Scrubber, 'scrubber');
export const ValueText = withContext(NumberInput.ValueText, 'valueText');
export const Context = NumberInput.Context;
