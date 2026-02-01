import { Dialog } from '@ark-ui/react/dialog';
import { ark } from '@ark-ui/react/factory';
import { createRecipeContext } from '~/utils/createRecipeContext';
import { alertDialogRecipe } from './AlertDialog.recipe';

const { withRootProvider, withContext } =
  createRecipeContext(alertDialogRecipe);

/**
 * @example
 * ```tsx
 * <AlertDialog.Root role="alertdialog">
 *   <AlertDialog.Trigger asChild>
 *     <Button>Trigger</Button>
 *   </AlertDialog.Trigger>
 *   <AlertDialog.Backdrop />
 *   <AlertDialog.Positioner>
 *     <AlertDialog.Content>
 *       <AlertDialog.CloseTrigger>
 *         <XCloseIcon />
 *       </AlertDialog.CloseTrigger>
 *       <AlertDialog.Header>
 *         <FeaturedIcon.Root>
 *           <FeaturedIcon.Icon asChild>
 *             <User01Icon />
 *           </FeaturedIcon.Icon>
 *         </FeaturedIcon.Root>
 *         <div>
 *           <AlertDialog.Title>Title</AlertDialog.Title>
 *           <AlertDialog.Description>Description</AlertDialog.Description>
 *         </div>
 *       </AlertDialog.Header>
 *       <AlertDialog.Footer>
 *         <Button variant="outline">Cancel</Button>
 *         <Button>Accept</Button>
 *       </AlertDialog.Footer>
 *     </AlertDialog.Content>
 *   </AlertDialog.Positioner>
 * </AlertDialog.Root>
 * ```
 */
export const Root = withRootProvider(Dialog.Root, {
  role: 'alertdialog',
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
export const Body = withContext(ark.section, 'body');
export const Header = withContext(ark.section, 'header');
export const Footer = withContext(ark.section, 'footer');
export const Context = Dialog.Context;
