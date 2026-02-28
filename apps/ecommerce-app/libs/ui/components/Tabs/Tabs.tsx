import { Tabs } from '@ark-ui/react/tabs';
import { createRecipeContext } from 'libs/utils/createRecipeContext';
import { tabsRecipe } from './Tabs.recipe';

const { withProvider, withContext } = createRecipeContext(tabsRecipe);

/**
 * @example
 * ```tsx
 * <Tabs.Root size="sm" defaultValue="1">
 *   <Tabs.List>
 *     <Tabs.Indicator />
 *     <Tabs.Trigger value="1">Tab 1</Tabs.Trigger>
 *     <Tabs.Trigger value="2">Tab 2</Tabs.Trigger>
 *     <Tabs.Trigger value="3">Tab 3</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="1">Content 1</Tabs.Content>
 *   <Tabs.Content value="2">Content 2</Tabs.Content>
 *   <Tabs.Content value="3">Content 3</Tabs.Content>
 * </Tabs.Root>
 * ```
 */
export const Root = withProvider(Tabs.Root, 'root');
export const Content = withContext(Tabs.Content, 'content');
export const Indicator = withContext(Tabs.Indicator, 'indicator');
export const List = withContext(Tabs.List, 'list');
export const Trigger = withContext(Tabs.Trigger, 'trigger');
export const Context = Tabs.Context;
