import * as React from "react";
import type { SVGProps } from "react";
const SvgMessageCircle = (props: SVGProps<SVGSVGElement>) => (
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
      d="M3.086 17.509a2 2 0 0 0-.094-1.167 10 10 0 1 1 4.777 4.719 2 2 0 0 0-1.099-.092l-3.413.998a1 1 0 0 1-1.236-1.168z"
    />
  </svg>
);
export default SvgMessageCircle;
