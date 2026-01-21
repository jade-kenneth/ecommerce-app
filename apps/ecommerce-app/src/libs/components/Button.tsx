'use client';
import type { ButtonProps, RecipeVariantProps } from '@chakra-ui/react';

import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

import { colors } from '../theme';
import { buttonRecipe } from '../theme/recipes/button';
import { hexToRgba } from '../utils';
type ButtonVariantProps = RecipeVariantProps<ReturnType<typeof buttonRecipe>>;
interface IButtonProps extends ButtonProps, ButtonVariantProps {
  colorTheme?: keyof typeof colors.colors;
}
const ChakraButton = dynamic(
  () => import('@chakra-ui/react').then((mod) => mod.Button),
  {
    ssr: false,
  }
);
export const Button = ({
  colorTheme = 'primary',
  ...props
}: PropsWithChildren<IButtonProps>) => {
  const theme = colorTheme.split('.')[0];
  const rgba = hexToRgba(
    (
      colors.colors[theme as keyof typeof colors.colors] as {
        [key: number]: { value: string };
      }
    )[100].value,
    0.5
  );
  const boxShadow = `0px 0px 0px 4px ${rgba}, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)`;

  return (
    <ChakraButton recipe={buttonRecipe(colorTheme, boxShadow)} {...props}>
      {props.children}
    </ChakraButton>
  );
};
