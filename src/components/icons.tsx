import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l-8 4 8 4 8-4-8-4z" />
      <path d="M4 10v8l8 4 8-4v-8" />
      <path d="M4 10l8 4 8-4" />
      <path d="M12 22v-8" />
    </svg>
  );
}
