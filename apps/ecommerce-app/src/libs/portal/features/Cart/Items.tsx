import { Item } from './Item';

export const Items = () => {
  const items = [
    {
      id: 1,
      name: 'Product 1',
      price: 29.99,
      quantity: 2,
    },
    {
      id: 2,
      name: 'Product 2',
      price: 49.99,
      quantity: 1,
    },
  ];
  return (
    <div className="flex flex-col gap-5 mt-5">
      {items.map((item) => (
        <Item key={item.id} />
      ))}
    </div>
  );
};
