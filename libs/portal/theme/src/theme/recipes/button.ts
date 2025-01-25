import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  variants: {
    customButton: {
      true: {
        border: '1px solid red',
        color: 'red',
        textAlign: 'center',
      },
    },
  },
});
