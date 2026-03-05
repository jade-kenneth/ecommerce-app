import { ark } from '@ark-ui/react';
import { createRecipeContext } from '~/utils';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { buttonRecipe } from './Button.recipe';

const { withProvider } = createRecipeContext(buttonRecipe);

const ButtonRoot = withProvider(ark.button, 'root');

export type ButtonProps = ComponentPropsWithoutRef<typeof ButtonRoot>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'button', ...props }, ref) => {
    return <ButtonRoot ref={ref} type={type} {...props} />;
  },
);

Button.displayName = 'Button';
