import * as React from "react";
import type { SVGProps } from "react";
const SvgSortAsc = (props: SVGProps<SVGSVGElement>) => (
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
      d="m3 8 4-4 4 4M7 4v16M11 12h4M11 16h7M11 20h10"
    />
  </svg>
);
export default SvgSortAsc;
