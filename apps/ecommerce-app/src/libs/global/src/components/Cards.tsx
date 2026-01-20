import { Flex, Text } from '@chakra-ui/react';

import Image from 'next/image';
import { FaHeart, FaStar } from 'react-icons/fa';
import { TbShoppingCartPlus } from 'react-icons/tb';
import { useCartContext } from '../../../portal/features/Cart/CartContext';
import {
  ProductCoreDataFragment,
  useAddToCartMutation,
} from '../graphql/generated';
import { useGlobalStore } from '../utils';
import { Button } from './Button';

interface CardsProps extends ProductCoreDataFragment {
  isTopSold?: boolean;
  isHighPoint?: boolean;
}
export const Cards = (props: CardsProps) => {
  const discount = parseFloat(
    (props.price * (props.discount / 100)).toFixed(2)
  );
  const [mutate] = useAddToCartMutation();
  const globalStore = useGlobalStore((state) => state);

  const context = useCartContext();
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
        overflow={'hidden'}
      >
        <Image
          src={props.thumbnail}
          alt="item"
          layout="fill"
          className="max-w-full aspect-[1/1]  object-cover"
        />

        <Flex
          direction={'column'}
          gap="5px"
          position={'absolute'}
          top={3}
          left={3}
        >
          {props.isTopSold && (
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
              <FaHeart size={12} />
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
              <Image src={'/medal.svg'} width={18} height={18} alt="medal" />
              <Text sizes={'paragraph-xs'}>HIGH-POINT</Text>
            </Flex>
          )}
        </Flex>
        {props.discount > 0 && (
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
            <Text sizes="paragraph-xs">{props.discount}%</Text>
            <Text sizes="paragraph-xs">OFF</Text>
          </Flex>
        )}
        <Flex
          bottom={0}
          left={0}
          position={'absolute'}
          className="flex items-center w-full"
        >
          {+props.points > 0 && (
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
                {props.points} points
              </Text>
            </Flex>
          )}
          {props.discount > 0 && (
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
              {(() => {
                const discountThreshold = 100000;
                return (
                  <Text sizes="paragraph-xs" className="!text-[10px]">
                    Save -{' '}
                    {discount.toLocaleString('en-US', {
                      currency: 'PHP',
                      style: 'currency',
                      maximumFractionDigits: 2,
                      ...(discount >= discountThreshold && {
                        notation: 'compact',
                        compactDisplay: 'short',
                      }),
                    })}
                  </Text>
                );
              })()}
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
            {(() => {
              const amount = props.price - discount;
              const useCompact = amount >= 1000000;

              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP',
                maximumFractionDigits: 2,
                ...(useCompact && {
                  notation: 'compact',
                  compactDisplay: 'short',
                }),
              }).format(amount);
            })()}
          </Text>
          {props.discount > 0 && (
            <Text
              color="colors.carbon.25"
              textDecoration={'line-through'}
              sizes={'paragraph-sm'}
              position={'relative'}
              top={0}
            >
              {(+props.price).toLocaleString('en-US', {
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
                  key={idx}
                  style={{
                    color: 3 >= idx + 1 ? '#FFA000' : '#D2D2D2',
                  }}
                />
              );
            })}
          </Flex>
          <Text color={'colors.carbon.500'} sizes={'paragraph-xs'}>
            {(100).toLocaleString('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            })}{' '}
            sold
          </Text>
        </Flex>
        <Button
          className="text-white items-center justify-center h-[40px] mt-3 flex gap-2  cursor-pointer"
          onClick={async () => {
            if (!globalStore.authenticate.isAuthenticated) {
              globalStore.signIn.setIsSignIn(true);
              return;
            }
            try {
              await mutate({
                variables: {
                  input: {
                    productId: props._id,
                    quantity: 1,
                  },
                },
              });
              context.addCartItem({
                name: props.name,
                price: props.price,
                productId: props._id,
                quantity: 1,
                thumbnail: props.thumbnail,
              });
            } catch (error) {
              /* empty */
            }
          }}
        >
          <TbShoppingCartPlus className="size-5 stroke-3" />{' '}
          <p className="text-base font-medium">Add to Cart</p>
        </Button>
      </Flex>
    </Flex>
  );
};
