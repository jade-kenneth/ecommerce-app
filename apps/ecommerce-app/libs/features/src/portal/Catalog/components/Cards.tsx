import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import Image from 'next/image';
import Link from 'next/link';

import { useCartContext } from '~/features/portal/Cart';
import { UPDATE_CART_ITEM_MUTATION } from '~/graphql/Cart';
import { ProductCoreDataFragment } from '~/graphql/generated';

import { useGlobalStore } from '~/hooks/useGlobalStore';
import { gtm } from '~/utils';
import { numberFormatter } from '~/utils/numberFormatter';
import { Button } from '~/components/Button';
import { toaster } from '~/components/ToastContainer';
interface CardsProps extends ProductCoreDataFragment {
  isTopSold?: boolean;
  isHighPoint?: boolean;
}
export const Cards = (props: CardsProps) => {
  const discount = parseFloat(
    (props.price * (props.discount / 100)).toFixed(2),
  );
  const [mutate] = useMutation(UPDATE_CART_ITEM_MUTATION);
  const isAuthenticated = useGlobalStore(
    (state) => state.authenticate.isAuthenticated,
  );
  const setAuthDialogOpen = useGlobalStore(
    (state) => state.authenticate.setAuthDialogOpen,
  );

  const context = useCartContext();
  return (
    <div className="w-full min-w-[194px] bg-white border border-carbon-900 rounded-[12px] flex flex-col h-auto">
      <Link
        href={`/product/${props._id}`}
        onClick={() => {
          gtm.gtmEvent('view_item', {
            item_id: props._id,
            item_name: props.name,
            price: props.price,
            categories: props.category,
          });
        }}
        className="h-[170px] sm:h-[194px] flex items-center justify-center bg-carbon-950 rounded-t-[12px] relative overflow-hidden"
        aria-label={`View ${props.name}`}
      >
        <Image
          src={props.thumbnail}
          alt="item"
          className="max-w-full aspect-[1/1] object-cover"
          layout="fill"
        />

        <div className="flex flex-col gap-[5px] absolute top-2 left-2 sm:top-3 sm:left-3">
          {props.isTopSold && (
            <div className="bg-error-600 w-[56px] sm:w-[62px] h-[24px] sm:h-[26px] rounded-[12px] flex items-center justify-center font-semibold text-white gap-1 text-[10px] sm:text-paragraph-xs">
              <Heart className="w-3 h-3" />
              <p>TOP</p>
            </div>
          )}
          {props.isHighPoint && (
            <div className="bg-success-700 h-[24px] sm:h-[26px] px-2 rounded-[12px] flex items-center justify-center font-semibold text-white gap-1 text-[10px] sm:text-paragraph-xs">
              <Image src={'/medal.svg'} width={16} height={16} alt="medal" />
              <p>HIGH-POINT</p>
            </div>
          )}
        </div>
        {props.discount > 0 && (
          <div className="absolute bg-cyan-700 w-[44px] h-[44px] sm:w-[50.95px] sm:h-[53px] rounded-tr-[12px] rounded-bl-[12px] text-white top-0 right-0 flex flex-col items-center justify-center text-[10px] sm:text-paragraph-xs">
            <p>{props.discount}%</p>
            <p>OFF</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 flex items-center w-full">
          {+props.points > 0 && (
            <div className="bg-warning-500 w-[64px] sm:w-[75px] h-[30px] sm:h-[34px] text-white flex justify-center items-center flex-col">
              <p className="text-[10px] sm:text-paragraph-xs font-semibold">
                {props.points} points
              </p>
            </div>
          )}
          {props.discount > 0 && (
            <div className="bg-[#FF6666] w-[80px] sm:w-[94px] h-[30px] sm:h-[34px] text-white flex justify-center items-center flex-col rounded-tr-[12px]">
              {(() => {
                const discountThreshold = 100000;
                return (
                  <p className="text-[10px] sm:text-paragraph-xs">
                    Save -{' '}
                    {numberFormatter.format(discount, {
                      locale: 'en-US',
                      currency: 'PHP',
                      ...(discount >= discountThreshold && { compact: true }),
                    })}
                  </p>
                );
              })()}
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-col p-3 sm:p-4">
        <Link
          href={`/product/${props._id}`}
          className="text-carbon-25 text-sm sm:text-paragraph-sm hover:text-cyan-600 transition-colors"
        >
          {props.name}
        </Link>
        <div className="flex flex-wrap gap-1 border-b border-carbon-900">
          <p className="text-carbon-25 font-bold text-base sm:text-paragraph-lg mb-[6px]">
            {(() => {
              const amount = props.price - discount;
              const useCompact = amount >= 1000000;

              return numberFormatter.format(amount, {
                locale: 'en-US',
                currency: 'PHP',
                ...(useCompact && { compact: true }),
              });
            })()}
          </p>
          {props.discount > 0 && (
            <p className="text-carbon-25 line-through text-xs sm:text-paragraph-sm relative top-0">
              {numberFormatter.format(props.price, {
                locale: 'en-US',
                currency: 'PHP',
              })}
            </p>
          )}
        </div>
        <div className="flex justify-between mt-3 items-center">
          <div className="flex gap-[2px]">
            {Array.from({ length: 5 }).map((_, idx) => {
              return (
                <Star
                  key={idx}
                  className="w-4 h-4"
                  style={{
                    color: props.avgRating >= idx + 1 ? '#FFA000' : '#D2D2D2',
                  }}
                  fill="currentColor"
                  stroke="currentColor"
                />
              );
            })}
          </div>
          <p className="text-carbon-500 text-xs sm:text-paragraph-xs">
            {numberFormatter.format(100, { locale: 'en-US', compact: true })}{' '}
            sold
          </p>
        </div>
        <Button
          className="text-white items-center justify-center h-[40px] mt-3 flex gap-2 cursor-pointer text-sm sm:text-base"
          onClick={async () => {
            if (!isAuthenticated) {
              setAuthDialogOpen(true);
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

              gtm.gtmEvent('add_to_cart', {
                product_id: props._id,
                product_name: props.name,
                discount: props.discount,
                categories: props.category,
              });

              toaster.success({
                description: `${props.name} added to cart.`,
              });
            } catch (error) {
              /* empty */
            }
          }}
        >
          <ShoppingCart className="size-5 stroke-2" />{' '}
          <p className="text-sm sm:text-base font-medium">Add to Cart</p>
        </Button>
      </div>
    </div>
  );
};
