import { Popover } from '@ark-ui/react/popover';
import { createRecipeContext } from '~/utils/createRecipeContext';
import { popoverRecipe } from './Popover.recipe';

const { withRootProvider, withContext } = createRecipeContext(popoverRecipe);

/**
 * @example
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>Trigger</Popover.Trigger>
 *   <Popover.Positioner>
 *     <Popover.Content>
 *       <Popover.Arrow>
 *         <Popover.ArrowTip />
 *       </Popover.Arrow>
 *       Hello World
 *     </Popover.Content>
 *   </Popover.Positioner>
 * </Popover.Root>
 * ```
 */
export const Root = withRootProvider(Popover.Root, {
  lazyMount: true,
});
export const Anchor = withContext(Popover.Anchor, 'anchor');
export const Arrow = withContext(Popover.Arrow, 'arrow');
export const ArrowTip = withContext(Popover.ArrowTip, 'arrowTip');
export const CloseTrigger = withContext(Popover.CloseTrigger, 'arrowTip');
export const Content = withContext(Popover.Content, 'content');
export const Description = withContext(Popover.Description, 'description');
export const Indicator = withContext(Popover.Indicator, 'indicator');
export const Positioner = withContext(Popover.Positioner, 'positioner');
export const Title = withContext(Popover.Title, 'title');
export const Trigger = withContext(Popover.Trigger, 'trigger');
export const Context = Popover.Context;
