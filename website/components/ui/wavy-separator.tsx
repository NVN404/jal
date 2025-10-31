import { cn } from '@/lib/utils';
import React from 'react';

interface WavySeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  // No custom props needed for now
}

export const WavySeparator = ({ className, ...props }: WavySeparatorProps) => {
  return (
    <div className={cn("w-full h-20 md:h-32", className)} {...props}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          className="fill-current"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,176C960,192,1056,192,1152,181.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};
