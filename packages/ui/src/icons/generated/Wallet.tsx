import * as React from "react";
import type { SVGProps } from "react";
const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 1 0 0 4h15a1 1 0 0 1 1 1v4m0 0h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
    />
  </svg>
);
export default SvgWallet;
