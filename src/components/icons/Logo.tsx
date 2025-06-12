
import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 240 50"
    aria-label="GamblrNation Hub Logo"
    role="img"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <style>
      {`
        .logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 30px;
          font-weight: 700;
          fill: url(#logoGradient);
          filter: drop-shadow(0 0 3px hsl(var(--primary) / 0.7)) drop-shadow(0 0 5px hsl(var(--accent) / 0.5));
        }
        .logo-letter-g {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 38px; /* Slightly larger for emphasis */
          font-weight: 700;
          fill: hsl(var(--primary));
          filter: drop-shadow(0 0 5px hsl(var(--primary) / 0.8));
        }
         .logo-letter-n {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 38px; /* Slightly larger for emphasis */
          font-weight: 700;
          fill: hsl(var(--accent));
           filter: drop-shadow(0 0 5px hsl(var(--accent) / 0.8));
        }
      `}
    </style>
    <text x="5" y="35" className="logo-letter-g">G</text>
    <text x="30" y="35" className="logo-text">amblr</text>
    <text x="115" y="35" className="logo-letter-n">N</text>
    <text x="140" y="35" className="logo-text">ation</text>
  </svg>
);

export default Logo;
