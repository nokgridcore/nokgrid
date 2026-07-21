import * as React from "react";
import type { SVGProps } from "react";
const SvgDownload = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 15V3M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m7 10 5 5 5-5"
    />
  </svg>
);
export default SvgDownload;
