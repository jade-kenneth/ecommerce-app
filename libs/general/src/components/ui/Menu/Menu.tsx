import { Menu } from '@ark-ui/react';

import { createRecipeContext } from '@utils';
import { menuRecipe } from './Menu.recipe';

const { withRootProvider, withContext } = createRecipeContext(menuRecipe);

/**
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Trigger>
 *     <DotsVerticalIcon />
 *   </Menu.Trigger>
 *   <Menu.Positioner>
 *     <Menu.Content>
 *       <Menu.ItemGroup>
 *         <Menu.Item value="1">Item 1</Menu.Item>
 *         <Menu.Item value="2">Item 2</Menu.Item>
 *         <Menu.Item value="3">Item 3</Menu.Item>
 *       </Menu.ItemGroup>
 *     </Menu.Content>
 *   </Menu.Positioner>
 * </Menu.Root>
 * ```
 */
export const Root = withRootProvider(Menu.Root);
export const Arrow = withContext(Menu.Arrow, 'arrow');
export const ArrowTip = withContext(Menu.ArrowTip, 'arrowTip');
export const CheckboxItem = withContext(Menu.CheckboxItem, 'item');
export const Content = withContext(Menu.Content, 'content');
export const ContextTrigger = withContext(
  Menu.ContextTrigger,
  'contextTrigger'
);
export const Indicator = withContext(Menu.Indicator, 'indicator');
export const Item = withContext(Menu.Item, 'item');
export const ItemGroup = withContext(Menu.ItemGroup, 'itemGroup');
export const ItemGroupLabel = withContext(
  Menu.ItemGroupLabel,
  'itemGroupLabel'
);
export const ItemIndicator = withContext(Menu.ItemIndicator, 'itemIndicator');
export const ItemText = withContext(Menu.ItemText, 'itemText');
export const Positioner = withContext(Menu.Positioner, 'positioner');
export const RadioItem = withContext(Menu.RadioItem, 'item');
export const RadioItemGroup = withContext(Menu.RadioItemGroup, 'itemGroup');
export const Separator = withContext(Menu.Separator, 'separator');
export const Trigger = withContext(Menu.Trigger, 'trigger');
export const TriggerItem = withContext(Menu.TriggerItem, 'triggerItem');
export const Context = Menu.Context;
export const ItemContext = Menu.ItemContext;
