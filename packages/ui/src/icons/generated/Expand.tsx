import * as React from "react";
import type { SVGProps } from "react";
const SvgExpand = (props: SVGProps<SVGSVGElement>) => (
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
      d="m15 15 6 6M15 9l6-6M21 16v5h-5M21 8V3h-5M3 16v5h5M3 21l6-6M3 8V3h5M9 9 3 3"
    />
  </svg>
);
export default SvgExpand;
