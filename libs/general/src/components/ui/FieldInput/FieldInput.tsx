import { Field } from '@ark-ui/react';
import { createRecipeContext } from '@utils';
import { fieldInputRecipe } from './FieldInput.recipe';

const { withContext, withProvider, withRootProvider } =
  createRecipeContext(fieldInputRecipe);

export const Root = withProvider(Field.Root, 'root');
export const RootProvider = withRootProvider(Field.RootProvider);
export const Label = withContext(Field.Label, 'label');

export const Input = withContext(Field.Input, 'input');
