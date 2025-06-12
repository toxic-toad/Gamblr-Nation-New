
import Link from 'next/link';
import { Send, Twitter as TwitterIcon } from 'lucide-react';
import Logo from '@/components/icons/Logo';

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-discord" viewBox="0 0 24 24">
  <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
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
