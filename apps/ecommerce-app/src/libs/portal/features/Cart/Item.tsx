import { TbTrash } from 'react-icons/tb';
import { Counter } from './Counter';

export const Item = () => {
  return (
    <div className="flex gap-4 w-[700px]  p-5 rounded-md shadow-sm hover:shadow-lg">
      <div className="w-[100px] h-[100px] bg-black rounded-lg" />
      <div className="flex flex-col gap-2">
        <h3 className="text-heading-6 font-semibold">Product Name</h3>
        <p className="text-paragraph-sm text-primary-700-value font-bold text-gray-600">
          $29.99
        </p>
        <p className="text-paragraph-sm text-gray-600">
          <Counter />
        </p>
      </div>
      <div className="flex flex-col justify-between items-center ml-auto">
        <p className="text-paragraph-xl text-gray-600 font-bold text-carbon-25-value">
          $59.97
        </p>
        <button className="text-sm text-red-600 font-semibold flex items-center gap-1 text-error-500-value">
          <TbTrash />
          Remove
        </button>
      </div>
    </div>
  );
};
