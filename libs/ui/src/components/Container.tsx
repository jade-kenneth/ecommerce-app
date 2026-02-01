import { Box, Flex, Text } from '@chakra-ui/react';
import { FunctionComponent, PropsWithChildren } from 'react';

interface ContainerProps {
  title?: string;
  subTitle?: string;
}

export const Container: FunctionComponent<
  PropsWithChildren<ContainerProps>
> = ({
  title = 'Explore Our Store and Find Your Essentials',
  subTitle = '',
  children,
}) => {
  return (
    <Box className="max-w-screen">
      <Box
        p="3.25rem"
        bg="#FCFCFC"
        position={'relative'}
        borderRadius={'24px'}
        mt="40px"
      >
        <Flex position={'relative'}>
          <Text
            sizes="heading-6"
            w="fit"
            borderBottomColor="colors.primary.700"
            position={'relative'}
            borderBottomWidth={'3px'}
            fontWeight={600}
            color="colors.carbon.200"
            zIndex={1}
          >
            {title}
          </Text>
          <Text
            sizes="paragraph-xs"
            w="fit"
            position={'relative'}
            fontWeight={600}
            ml="8px"
            color="colors.primary.700"
          >
            {subTitle}
          </Text>
          <Box
            borderBottomColor="colors.carbon.900"
            borderBottomWidth="1px"
            w={'full'}
            position={'absolute'}
            bottom={'1px'}
          />
        </Flex>
        <Box mt="27px">{children}</Box>
      </Box>
    </Box>
  );
};
