import { Badge, Flex, Text } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

interface FrequentlySearchedProps {}

export const FrequentlySearched: FunctionComponent<
  FrequentlySearchedProps
> = () => {
  return (
    <Flex py="16px" borderBottom={'1px solid #EAEAEA'}>
      <Flex
        className="max-w-screen"
        align={'center'}
        flexWrap={'wrap'}
        gap="16px"
      >
        <Text sizes={'paragraph-sm'} color="colors.carbon.500">
          Frequently searched:{' '}
        </Text>
        {[
          'Snacks',
          'Soft drinks',
          'Instant noodles',
          'Canned goods',
          'Daily Dishes',
          'Seasonings',
          'Shop and hair care products',
          'Coffee and powdered milk',
        ].map((searched) => {
          return (
            <Badge
              key={searched}
              variant="plain"
              py="8px"
              px="14px"
              bg="colors.primary.50"
              color={'colors.primary.700'}
              rounded={'32px'}
            >
              {searched}
            </Badge>
          );
        })}
      </Flex>
    </Flex>
  );
};
