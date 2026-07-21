import * as React from "react";
import type { SVGProps } from "react";
const SvgDatabase = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 8c4.97 0 9-1.343 9-3s-4.03-3-9-3-9 1.343-9 3 4.03 3 9 3"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5v14c0 .796.948 1.559 2.636 2.121S9.613 22 12 22s4.676-.316 6.364-.879S21 19.796 21 19V5"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12c0 .796.948 1.559 2.636 2.121S9.613 15 12 15s4.676-.316 6.364-.879S21 12.796 21 12"
    />
  </svg>
);
export default SvgDatabase;
