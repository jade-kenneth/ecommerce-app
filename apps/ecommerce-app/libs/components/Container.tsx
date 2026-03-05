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
      <div className="p-4 sm:p-6 lg:p-[3.25rem] bg-[#FCFCFC] relative rounded-2xl sm:rounded-[24px] mt-6 sm:mt-10">
        <div className="relative pb-2 sm:pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="w-fit border-b-[3px] border-b-cyan-700 font-semibold text-carbon-200 z-[1] text-base sm:text-heading-6">
              {title}
            </p>
            {subTitle && (
              <p className="w-fit relative font-semibold text-cyan-700 text-xs sm:text-paragraph-xs">
                {subTitle}
              </p>
            )}
          </div>
          <div className="border-b border-carbon-900 w-full absolute -bottom-[1px]" />
        </div>
        <div className="mt-4 sm:mt-[27px]">{children}</div>
      </div>
    </div>
  );
};
