import { Combobox, createListCollection } from '@ark-ui/react';

import { createRecipeContext } from '@utils';
import { comboboxRecipe } from './ComboboxField.recipe';
const { withProvider, withRootProvider, withContext } =
  createRecipeContext(comboboxRecipe);

/**
 * @example
 * ```tsx
 * <Combobox.Root
 *   collection={collection}
 *   positioning={{
 *     sameWidth: true,
 *   }}
 * >
 *   <Combobox.Control>
 *     <Combobox.Input placeholder="Search" />
 *     <Combobox.ClearTrigger>
 *       <XCloseIcon />
 *     </Combobox.ClearTrigger>
 *     <Combobox.Trigger>
 *       <ChevronDownIcon />
 *     </Combobox.Trigger>
 *   </Combobox.Control>
 *   <Combobox.Positioner>
 *     <Combobox.Content>
 *       <Combobox.ItemGroup>
 *         {collection.items.map((item) => (
 *           <Combobox.Item key={item.value} item={item}>
 *             {item.label}
 *           </Combobox.Item>
 *         ))}
 *       </Combobox.ItemGroup>
 *     </Combobox.Content>
 *   </Combobox.Positioner>
 * </Combobox.Root>
 * ```
 */
export const Root = withProvider(Combobox.Root<any>, 'root');
export const RootProvider = withRootProvider(Combobox.RootProvider<any>);
export const Label = withContext(Combobox.Label, 'label');
export const Control = withContext(Combobox.Control, 'control');
export const Input = withContext(Combobox.Input, 'input');
export const Trigger = withContext(Combobox.Trigger, 'trigger');
export const ClearTrigger = withContext(Combobox.ClearTrigger, 'clearTrigger');
export const Positioner = withContext(Combobox.Positioner, 'positioner');
export const Content = withContext(Combobox.Content, 'content');
export const ItemGroup = withContext(Combobox.ItemGroup, 'itemGroup');
export const ItemGroupLabel = withContext(
  Combobox.ItemGroupLabel,
  'itemGroupLabel'
);
export const Item = withContext(Combobox.Item, 'item');
export const ItemText = withContext(Combobox.ItemText, 'itemText');
export const ItemIndicator = withContext(
  Combobox.ItemIndicator,
  'itemIndicator'
);
export const List = withContext(Combobox.List, 'list');
export const Context = Combobox.Context;
export const ItemContext = Combobox.ItemContext;
export const collection = createListCollection;
