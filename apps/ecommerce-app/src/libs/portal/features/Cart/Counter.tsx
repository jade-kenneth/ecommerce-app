import { Input } from '../../../global/src';

export const Counter = () => {
  return (
    <div className="flex items-center gap-2 w-fit">
      <button>-</button>
      <Input type="number" defaultValue={0} className="w-[50px]" />
      <button>+</button>
    </div>
  );
};
