import * as React from "react";
import type { SVGProps } from "react";
const SvgCoins = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.744 17.736a6 6 0 1 1-7.48-7.48M15 6h1v4"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m6.134 14.768.866-.5 2 3.464M16 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12"
    />
  </svg>
);
export default SvgCoins;
