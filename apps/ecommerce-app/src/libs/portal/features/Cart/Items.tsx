import Image from 'next/image';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { TbTrash } from 'react-icons/tb';
import { Input, useGlobalStore } from '../../../global/src';
import { useCartContext } from './CartContext';
export const Items = () => {
  const globalStore = useGlobalStore((state) => state);
  const context = useCartContext();

  const form = useForm({
    defaultValues: {
      items: context.state.cart.items,
    },
  });
  const watchedItems = useWatch({
    control: form.control,
    name: 'items',
  });

  return (
    <div className="flex flex-col gap-5 mt-5">
      {watchedItems?.map((item, idx) => {
        let quantity = form.getValues(`items.${idx}.quantity`) || 1;
        return (
          <div className="flex gap-4 w-full  p-5 rounded-md shadow-lg border-[1px] border-[#f2efef] hover:shadow-lg">
            <Image
              src={item.thumbnail || ''}
              alt="Product Image"
              width={100}
              height={100}
              className="w-[120px] h-[120px] bg-black rounded-lg"
            />
            <div className="flex my-auto flex-col gap-2">
              <h3 className="text-heading-6 font-semibold">{item.name}</h3>
              <p className="text-paragraph-sm text-primary-700-value font-bold text-gray-600">
                ₱{item.price}
              </p>
              <p className="text-paragraph-sm text-gray-600">
                <div className="flex items-center gap-2 w-fit">
                  <button
                    className="text-lg cursor-pointer"
                    onClick={() => {
                      if (quantity <= 1) return;

                      form.setValue(
                        `items.${idx}.quantity`,
                        (form.getValues(`items.${idx}.quantity`) || 1) - 1
                      );

                      quantity -= 1;

                      context.addCartItem(item);
                    }}
                  >
                    -
                  </button>
                  <Controller
                    control={form.control}
                    name={`items.${idx}.quantity`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        value={field.value?.toString() || '1'}
                        className="w-[90px]"
                        onChange={(e) => {
                          field.onChange(Number(e));
                        }}
                      />
                    )}
                  />
                  <button
                    className="text-lg cursor-pointer"
                    onClick={() => {
                      form.setValue(
                        `items.${idx}.quantity`,
                        (form.watch(`items.${idx}.quantity`) || 1) + 1
                      );
                      context.addCartItem(item);
                    }}
                  >
                    +
                  </button>
                </div>
              </p>
            </div>
            <div className="flex flex-col justify-between items-center ml-auto">
              <p className="text-paragraph-xl text-gray-600 font-bold text-carbon-25-value">
                ₱
                {Number(item.price) *
                  (form.watch(`items.${idx}.quantity`) || 1)}
              </p>
              <button className="text-sm text-red-600 font-semibold flex items-center gap-1 text-error-500-value">
                <TbTrash />
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
