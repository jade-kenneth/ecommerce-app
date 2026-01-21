import { SVGProps } from 'react';

export const PhoneIcon = ({
  path,
  svgProps,
}: {
  svgProps?: SVGProps<SVGSVGElement>;
  path?: SVGProps<SVGPathElement>;
}) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        d="M7.875 3.6H7.725V3.75V4.5V4.65H7.875H10.125H10.275V4.5V3.75V3.6H10.125H7.875Z"
        fill="#004E4E"
        stroke="#004E4E"
        strokeWidth="0.3"
        {...path}
      />
      <path
        d="M9.6 13.5C9.6 13.8314 9.33137 14.1 9 14.1C8.66863 14.1 8.4 13.8314 8.4 13.5C8.4 13.1686 8.66863 12.9 9 12.9C9.33137 12.9 9.6 13.1686 9.6 13.5Z"
        fill="#004E4E"
        stroke="#004E4E"
        strokeWidth="0.3"
        {...path}
      />
      <path
        d="M12 16.65C12.9078 16.65 13.65 15.9078 13.65 15V3C13.65 2.09216 12.9078 1.35 12 1.35H6C5.09216 1.35 4.35 2.09216 4.35 3V15C4.35 15.9078 5.09216 16.65 6 16.65H12ZM5.4 15V3C5.4 2.66922 5.66922 2.4 6 2.4H12C12.3308 2.4 12.6 2.66922 12.6 3V15C12.6 15.3308 12.3308 15.6 12 15.6H6C5.66922 15.6 5.4 15.3308 5.4 15Z"
        fill="#004E4E"
        stroke="#004E4E"
        strokeWidth="0.3"
        {...path}
      />
    </svg>
  );
};
