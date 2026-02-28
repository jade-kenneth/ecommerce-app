import { Dialog } from '@ark-ui/react/dialog';
import { ark } from '@ark-ui/react/factory';
import { createRecipeContext } from 'libs/utils/createRecipeContext';
import { dialogRecipe } from './Dialog.recipe';

const { withRootProvider, withContext } = createRecipeContext(dialogRecipe);

/**
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger asChild>
 *     <Button>Trigger</Button>
 *   </Dialog.Trigger>
 *   <Dialog.Backdrop />
 *   <Dialog.Positioner>
 *     <Dialog.Content>
 *       <Dialog.CloseTrigger>
 *         <XCloseIcon />
 *       </Dialog.CloseTrigger>
 *       <Dialog.Header>
 *         <FeaturedIcon.Root>
 *           <FeaturedIcon.Icon asChild>
 *             <User01Icon />
 *           </FeaturedIcon.Icon>
 *         </FeaturedIcon.Root>
 *         <div>
 *           <Dialog.Title>Title</Dialog.Title>
 *           <Dialog.Description>Description</Dialog.Description>
 *         </div>
 *       </Dialog.Header>
 *       <Dialog.Body>Content</Dialog.Body>
 *       <Dialog.Footer>
 *         <Button variant="outline">Cancel</Button>
 *         <Button>Submit</Button>
 *       </Dialog.Footer>
 *     </Dialog.Content>
 *   </Dialog.Positioner>
 * </Dialog.Root>
 * ```
 */
export const Root = withRootProvider(Dialog.Root, {
  role: 'dialog',
  lazyMount: true,
  unmountOnExit: false,
  closeOnEscape: false,
  closeOnInteractOutside: false,
});
export const Backdrop = withContext(Dialog.Backdrop, 'backdrop');
export const CloseTrigger = withContext(Dialog.CloseTrigger, 'closeTrigger');
export const Content = withContext(Dialog.Content, 'content');
export const Description = withContext(Dialog.Description, 'description');
export const Positioner = withContext(Dialog.Positioner, 'positioner');
export const Title = withContext(Dialog.Title, 'title');
export const Trigger = withContext(Dialog.Trigger, 'trigger');
export const Header = withContext(ark.section, 'header');
export const Body = withContext(ark.section, 'body');
export const Footer = withContext(ark.section, 'footer');
export const Context = Dialog.Context;
