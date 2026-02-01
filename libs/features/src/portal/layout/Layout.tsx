import { PropsWithChildren } from 'react';

export const Layout = (props: PropsWithChildren) => {
  return (
    // don't change this
    <div className="min-w-[1280px] mx-auto ">{props.children}</div>
  );
};
