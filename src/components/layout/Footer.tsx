
import Link from 'next/link';
import { Send, Twitter as TwitterIcon } from 'lucide-react';
import Logo from '@/components/icons/Logo';

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
<svg id="Discord-Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.644 96">
  <defs>
    <style>{`.cls-1{fill:#5865f2;}`}</style>
  </defs>
  <path id="Discord-Symbol-Blurple" className="cls-1" d="M81.15,0c-1.2376,2.1973-2.3489,4.4704-3.3591,6.794-9.5975-1.4396-19.3718-1.4396-28.9945,0-.985-2.3236-2.1216-4.5967-3.3591-6.794-9.0166,1.5407-17.8059,4.2431-26.1405,8.0568C2.779,32.5304-1.6914,56.3725.5312,79.8863c9.6732,7.1476,20.5083,12.603,32.0505,16.0884,2.6014-3.4854,4.8998-7.1981,6.8698-11.0623-3.738-1.3891-7.3497-3.1318-10.8098-5.1523.9092-.6567,1.7932-1.3386,2.6519-1.9953,20.281,9.547,43.7696,9.547,64.0758,0,.8587.7072,1.7427,1.3891,2.6519,1.9953-3.4601,2.0457-7.0718,3.7632-10.835,5.1776,1.97,3.8642,4.2683,7.5769,6.8698,11.0623,11.5419-3.4854,22.3769-8.9156,32.0509-16.0631,2.626-27.2771-4.496-50.9172-18.817-71.8548C98.9811,4.2684,90.1918,1.5659,81.1752.0505l-.0252-.0505ZM42.2802,65.4144c-6.2383,0-11.4159-5.6575-11.4159-12.6535s4.9755-12.6788,11.3907-12.6788,11.5169,5.708,11.4159,12.6788c-.101,6.9708-5.026,12.6535-11.3907,12.6535ZM84.3576,65.4144c-6.2637,0-11.3907-5.6575-11.3907-12.6535s4.9755-12.6788,11.3907-12.6788,11.4917,5.708,11.3906,12.6788c-.101,6.9708-5.026,12.6535-11.3906,12.6535Z"/>
</svg>
);

const TwitchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0H6zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714v9.429z"/>
  </svg>
);

const KickIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 3h2.5l6 7.5L7.5 18H5l6-7.5L5 3zm7.5 0H15l6 7.5-6 7.5h-2.5l6-7.5-6-7.5z"/>
  </svg>
);


const socialLinks = [
  { name: 'Discord', href: 'https://discord.gg/4rMAp8am', icon: DiscordIcon, brandColorClass: 'text-[#5865F2]' },
  { name: 'Twitch', href: 'https://www.twitch.tv/afterhoursaz', icon: TwitchIcon, brandColorClass: 'text-[#9146FF]' },
  { name: 'Kick', href: 'https://kick.com/afterhoursaz', icon: KickIcon, brandColorClass: 'text-[#53FC18]' },
  { name: 'Telegram', href: 'https://discord.gg/4rMAp8am', icon: Send, brandColorClass: 'text-[#2AABEE]' },
  { name: 'Twitter', href: 'https://x.com/atzell69', icon: TwitterIcon, brandColorClass: 'text-primary' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
             <Logo className="h-8 w-auto mr-2" />
             <p className="text-sm text-muted-foreground">&copy; {currentYear} GamblrNation Hub. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className={`${link.brandColorClass} transition-opacity hover:opacity-80`}
              >
                <link.icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
