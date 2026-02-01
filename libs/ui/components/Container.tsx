import { FunctionComponent, PropsWithChildren } from 'react';

interface ContainerProps {
  title?: string;
  subTitle?: string;
}

export const Container: FunctionComponent<
  PropsWithChildren<ContainerProps>
> = ({
  title = 'Explore Our Store and Find Your Essentials',
  subTitle = '',
  children,
}) => {
  return (
    <div className="max-w-screen">
      <div className="p-[3.25rem] bg-[#FCFCFC] relative rounded-[24px] mt-10">
        <div className="relative flex items-center">
          <p className="w-fit border-b-[3px] border-b-cyan-700 font-semibold text-carbon-200 z-[1] text-heading-6">
            {title}
          </p>
          <p className="w-fit relative font-semibold ml-2 text-cyan-700 text-paragraph-xs">
            {subTitle}
          </p>
          <div className="border-b border-carbon-900 w-full absolute -bottom-[1px]" />
        </div>
        <div className="mt-[27px]">{children}</div>
      </div>
    </div>
  );
};
