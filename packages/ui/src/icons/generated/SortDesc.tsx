import * as React from "react";
import type { SVGProps } from "react";
const SvgSortDesc = (props: SVGProps<SVGSVGElement>) => (
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
      d="m3 16 4 4 4-4M7 20V4M11 4h10M11 8h7M11 12h4"
    />
  </svg>
);
export default SvgSortDesc;
