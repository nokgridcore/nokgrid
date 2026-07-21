import * as React from "react";
import type { SVGProps } from "react";
const SvgNavigation2 = (props: SVGProps<SVGSVGElement>) => (
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
      d="m12 2 7 19-7-4-7 4z"
    />
  </svg>
);
export default SvgNavigation2;
