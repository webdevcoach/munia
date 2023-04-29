import * as React from 'react';
import { SVGProps } from 'react';
const SvgCircleActionsClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke={props.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m9 9 6 6m-6 0 6-6m8 3c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11Z"
    />
  </svg>
);
export default SvgCircleActionsClose;
