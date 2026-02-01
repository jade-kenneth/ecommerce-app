export const Sticky = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sticky  top-0 z-10 w-full bg-white border-b border-[#EAEAEA]">
      {children}
    </div>
  );
};
