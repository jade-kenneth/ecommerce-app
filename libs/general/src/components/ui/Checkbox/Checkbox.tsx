import { Checkbox } from '@ark-ui/react';

import { createRecipeContext } from '@utils';
import { checkboxRecipe } from './Checkbox.recipe';

const { withProvider, withContext } = createRecipeContext(checkboxRecipe);

/**
 * @example
 * ```tsx
 * <Checkbox.Root>
 *   <Checkbox.Control>
 *     <Checkbox.Indicator asChild>
 *       <CheckIcon />
 *     </Checkbox.Indicator>
 *   </Checkbox.Control>
 *   <Checkbox.Label>Label</Checkbox.Label>
 *   <Checkbox.HiddenInput />
 * </Checkbox.Root>
 * ```
 */
export const Root = withProvider(Checkbox.Root, 'root');
export const Indicator = withContext(Checkbox.Indicator, 'indicator');
export const Control = withContext(Checkbox.Control, 'control');
export const Group = withContext(Checkbox.Group, 'group');
export const Label = withContext(Checkbox.Label, 'label');
export const HiddenInput = Checkbox.HiddenInput;
export const Context = Checkbox.Context;
