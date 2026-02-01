import Image from 'next/image';
import { FaHeart, FaStar } from 'react-icons/fa';
import { TbShoppingCartPlus } from 'react-icons/tb';

import { useCartContext } from '~/features/portal';
import {
  ProductCoreDataFragment,
  useAddToCartMutation,
} from '~/graphql/generated';

import { useGlobalStore } from '~/hooks/useGlobalStore';
import { Button } from './Button';
interface CardsProps extends ProductCoreDataFragment {
  isTopSold?: boolean;
  isHighPoint?: boolean;
}
export const Cards = (props: CardsProps) => {
  const discount = parseFloat(
    (props.price * (props.discount / 100)).toFixed(2),
  );
  const [mutate] = useAddToCartMutation();
  const globalStore = useGlobalStore((state) => state);

  const context = useCartContext();
  return (
    <div className="w-[220.8px] bg-white border border-carbon-900 rounded-[12px] flex flex-col h-auto">
      <div className="h-[194px] flex items-center justify-center bg-carbon-950 rounded-t-[12px] relative overflow-hidden">
        <Image
          src={props.thumbnail}
          alt="item"
          className="max-w-full aspect-[1/1]  object-cover"
          layout="fill"
        />

        <div className="flex flex-col gap-[5px] absolute top-3 left-3">
          {props.isTopSold && (
            <div className="bg-error-600 w-[62px] h-[26px] rounded-[12px] flex items-center justify-center font-semibold text-white gap-1">
              <FaHeart size={12} />
              <p className="text-paragraph-xs">TOP</p>
            </div>
          )}
          {props.isHighPoint && (
            <div className="bg-success-700 h-[26px] px-2 rounded-[12px] flex items-center justify-center font-semibold text-white gap-1">
              <Image src={'/medal.svg'} width={18} height={18} alt="medal" />
              <p className="text-paragraph-xs">HIGH-POINT</p>
            </div>
          )}
        </div>
        {props.discount > 0 && (
          <div className="absolute bg-cyan-700 w-[50.95px] h-[53px] rounded-tr-[12px] rounded-bl-[12px] text-white top-0 right-0 flex flex-col items-center justify-center">
            <p className="text-paragraph-xs">{props.discount}%</p>
            <p className="text-paragraph-xs">OFF</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 flex items-center w-full">
          {+props.points > 0 && (
            <div className="bg-warning-500 w-[75px] h-[34px] text-white flex justify-center items-center flex-col">
              <p className="text-paragraph-xs font-semibold">
                {props.points} points
              </p>
            </div>
          )}
          {props.discount > 0 && (
            <div className="bg-[#FF6666] w-[94px] h-[34px] text-white flex justify-center items-center flex-col rounded-tr-[12px]">
              {(() => {
                const discountThreshold = 100000;
                return (
                  <p className="text-paragraph-xs !text-[10px]">
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
                  </p>
                );
              })()}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col p-3">
        <p className="text-carbon-25 text-paragraph-sm">{props.name}</p>
        <div className="flex gap-1 border-b border-carbon-900">
          <p className="text-carbon-25 font-bold text-paragraph-lg mb-[6px]">
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
          </p>
          {props.discount > 0 && (
            <p className="text-carbon-25 line-through text-paragraph-sm relative top-0">
              {(+props.price).toLocaleString('en-US', {
                currency: 'PHP',
                style: 'currency',
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
        <div className="flex justify-between mt-3 items-center">
          <div className="flex gap-[2px]">
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
          </div>
          <p className="text-carbon-500 text-paragraph-xs">
            {(100).toLocaleString('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            })}{' '}
            sold
          </p>
        </div>
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
                discount: props.discount,
                categories: props.category,
              });
            } catch (error) {
              /* empty */
            }
          }}
        >
          <TbShoppingCartPlus className="size-5 stroke-3" />{' '}
          <p className="text-base font-medium">Add to Cart</p>
        </Button>
      </div>
    </div>
  );
};
