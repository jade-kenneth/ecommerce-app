import type { ButtonProps, RecipeVariantProps } from '@chakra-ui/react';
import { Button as ChakraButton } from '@chakra-ui/react';

import { buttonRecipe, colors } from '@portal/theme';
import { PropsWithChildren } from 'react';
import { hexToRgba } from '../utils';

type ButtonVariantProps = RecipeVariantProps<ReturnType<typeof buttonRecipe>>;
interface IButtonProps extends ButtonProps, ButtonVariantProps {
  colorTheme?: keyof typeof colors.colors;
}

export const Button = ({
  colorTheme = 'primary',
  ...props
}: PropsWithChildren<IButtonProps>) => {
  const rgba = hexToRgba(colors.colors[colorTheme][100].value, 0.5);
  const boxShadow = `0px 0px 0px 4px ${rgba}, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)`;

  return (
    <ChakraButton recipe={buttonRecipe(colorTheme, boxShadow)} {...props}>
      {props.children}
    </ChakraButton>
  );
};
