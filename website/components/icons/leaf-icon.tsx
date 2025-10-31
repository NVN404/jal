import React from 'react';

export function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 4 13q0-4 7-9 7 5 7 9a7 7 0 0 1-7 7z" />
      <path d="M12 18a7 7 0 0 0 7-7" />
    </svg>
  );
}
