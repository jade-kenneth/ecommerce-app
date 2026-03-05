import React, { FunctionComponent } from 'react';

export const Sticky: FunctionComponent<{ children: React.ReactNode }> =
  React.memo(({ children }) => {
    return (
      <div className="sticky  top-0 z-10 w-full bg-white border-b border-[#EAEAEA]">
        {children}
      </div>
    );
  });
