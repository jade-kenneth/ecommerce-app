import { Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FaHeart, FaStar } from 'react-icons/fa';
import { medal } from '../images';
import { CardProps } from './types';

export const Cards = (props: CardProps) => {
  const discount = (props.price * (props.offPercent / 100)).toFixed(2);
  return (
    <Flex
      w="220.8px"
      bg="white"
      borderColor="colors.carbon.900"
      borderWidth={'1px'}
      borderRadius={'12px'}
      direction={'column'}
      h="auto"
    >
      <Flex
        height={'194px'}
        align={'center'}
        bg="colors.carbon.950"
        borderTopLeftRadius={'12px'}
        borderTopRightRadius={'12px'}
        justify={'center'}
        position={'relative'}
      >
        <Image
          src={props.imgSrc}
          alt="item"
          objectFit="cover"
          width={100}
          height={100}
        />

        <Flex
          direction={'column'}
          gap="5px"
          position={'absolute'}
          top={3}
          left={3}
        >
          {props.isTop && (
            <Flex
              bg="colors.error.600"
              width={'62px'}
              height={'26px'}
              borderRadius={'12px'}
              alignItems={'center'}
              justify={'center'}
              fontWeight={600}
              color="white"
              gap="4px"
            >
              <FaHeart size={'12'} />
              <Text sizes={'paragraph-xs'}>TOP</Text>
            </Flex>
          )}
          {props.isHighPoint && (
            <Flex
              bg="colors.success.700"
              height={'26px'}
              px="8px"
              borderRadius={'12px'}
              alignItems={'center'}
              justify={'center'}
              fontWeight={600}
              color="white"
              gap="4px"
            >
              <Image src={medal} width={18} height={18} alt="medal" />
              <Text sizes={'paragraph-xs'}>HIGH-POINT</Text>
            </Flex>
          )}
        </Flex>
        {props.offPercent > 0 && (
          <Flex
            position={'absolute'}
            bg={'colors.primary.700'}
            width={'50.95px'}
            height={'53px'}
            borderTopRightRadius={'12px'}
            borderBottomLeftRadius={'12px'}
            color="white"
            top={0}
            right={0}
            justifyContent={'center'}
            alignItems={'center'}
            direction={'column'}
          >
            <Text sizes="paragraph-xs">{props.offPercent}%</Text>
            <Text sizes="paragraph-xs">OFF</Text>
          </Flex>
        )}
        <Flex bottom={0} left={0} position={'absolute'}>
          {props.rewards > 0 && (
            <Flex
              bg={'colors.warning.500'}
              width={'75px'}
              height={'34px'}
              color="white"
              justifyContent={'center'}
              alignItems={'center'}
              direction={'column'}
            >
              <Text sizes="paragraph-xs" fontWeight={600}>
                {props.rewards} points
              </Text>
            </Flex>
          )}
          {props.offPercent > 0 && (
            <Flex
              bg={'#FF6666'}
              width={'94px'}
              height={'34px'}
              color="white"
              justifyContent={'center'}
              borderTopRightRadius={'12px'}
              alignItems={'center'}
              direction={'column'}
            >
              <Text sizes="paragraph-xs">
                Save -
                {(props.price * (props.offPercent / 100)).toLocaleString(
                  'en-US',
                  {
                    currency: 'PHP',
                    style: 'currency',
                    maximumFractionDigits: 2,
                  }
                )}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Flex direction={'column'} p="12px">
        <Text color="colors.carbon.25" sizes={'paragraph-sm'}>
          {props.name}
        </Text>
        <Flex
          gap={'4px'}
          borderBottomColor={'colors.carbon.900'}
          borderBottomWidth={'1px'}
        >
          <Text
            color="colors.carbon.25"
            fontWeight={700}
            sizes={'paragraph-lg'}
            mb="6px"
          >
            {(props.price - +discount).toLocaleString('en-US', {
              currency: 'PHP',
              style: 'currency',
              maximumFractionDigits: 2,
            })}
          </Text>
          {props.offPercent > 0 && (
            <Text
              color="colors.carbon.25"
              textDecoration={'line-through'}
              sizes={'paragraph-sm'}
              position={'relative'}
              top={0}
            >
              {props.price.toLocaleString('en-US', {
                currency: 'PHP',
                style: 'currency',
                maximumFractionDigits: 2,
              })}
            </Text>
          )}
        </Flex>
        <Flex justifyContent={'space-between'} mt="12px" alignItems={'center'}>
          <Flex gap={'2px'}>
            {Array.from({ length: 5 }).map((_, idx) => {
              return (
                <FaStar
                  style={{
                    color: props.rating >= idx + 1 ? '#FFA000' : '#D2D2D2',
                  }}
                />
              );
            })}
          </Flex>
          <Text color={'colors.carbon.500'} sizes={'paragraph-xs'}>
            {props.sold.toLocaleString('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            })}{' '}
            sold
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
