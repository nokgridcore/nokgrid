import * as React from "react";
import type { SVGProps } from "react";
const SvgGripVertical = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2M9 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2M15 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2M15 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
    />
  </svg>
);
export default SvgGripVertical;
