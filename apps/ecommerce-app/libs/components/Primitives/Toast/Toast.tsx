import { ark, Toast } from '@ark-ui/react';

import { createRecipeContext } from '~/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toastRecipe } from './Toast.recipe';

const { withContext, withProvider } = createRecipeContext(toastRecipe);

export const Root = withProvider(Toast.Root, 'root');
export const ActionTrigger = withContext(Toast.ActionTrigger, 'actionTrigger');
export const CloseTrigger = withContext(Toast.CloseTrigger, 'closeTrigger');
export const Description = withContext(Toast.Description, 'description');
export const Title = withContext(Toast.Title, 'title');
export const Group = withContext(ark.div, 'group');
export const Context = Toast.Context;
export const Icon = () => {
  return (
    <Toast.Context>
      {({ type }) => {
        const Component =
          type === 'error' || type === 'warning' ? AlertCircle : CheckCircle2;

        return (
          <div className="flex size-[38px] shrink-0 items-center justify-center rounded-full border-2 ui-group-type-error:border-[#F04438]/10 ui-group-type-warning:border-[#F79009]/10 ui-group-type-success:border-[#17B26A]/10">
            <div className="flex size-[28px] items-center justify-center rounded-full border-2 ui-group-type-error:border-[#F04438]/30 ui-group-type-warning:border-[#F79009]/30 ui-group-type-success:border-[#17B26A]/30">
              <Component className="size-[20px] ui-group-type-error:text-[#F04438] ui-group-type-warning:text-[#F79009] ui-group-type-success:text-[#17B26A]" />
            </div>
          </div>
        );
      }}
    </Toast.Context>
  );
};
