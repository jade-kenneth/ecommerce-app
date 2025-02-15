import { Box, Text } from '@chakra-ui/react';
import { FunctionComponent, PropsWithChildren } from 'react';

interface ContainerProps {
  title?: string;
}

const Container: FunctionComponent<PropsWithChildren<ContainerProps>> = ({
  title = 'Explore Our Store and Find Your Essentials',
  children,
}) => {
  return (
    <Box
      p="3.25rem"
      bg="#FCFCFC"
      position={'relative'}
      borderRadius={'24px'}
      _before={{
        content: '""',
        position: 'absolute',
        top: '85px',
        width: '92%',
        borderBottomColor: 'colors.carbon.900',
        borderBottomWidth: '1px',
      }}
    >
      <Text
        sizes="heading-6"
        w="fit"
        borderBottomColor="colors.primary.700"
        position={'relative'}
        borderBottomWidth={'3px'}
        fontWeight={600}
        color="colors.carbon.200"
      >
        {title}
      </Text>
      <Box mt="27px">{children}</Box>
    </Box>
  );
};

export default Container;
