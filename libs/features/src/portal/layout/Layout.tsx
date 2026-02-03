import { PropsWithChildren } from 'react';

export const Layout = (props: PropsWithChildren) => {
  return (
    <div className="w-full min-h-screen mx-auto overflow-x-hidden">
      {props.children}
    </div>
  );
};
