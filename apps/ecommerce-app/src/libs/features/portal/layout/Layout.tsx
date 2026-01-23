import { PropsWithChildren } from 'react';
import { ColorModeProvider } from '~/components/chakra__prebuilts';

export const Layout = (props: PropsWithChildren) => {
  return (
    <div className="min-w-[1280px] mx-auto">
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </div>
  );
};
