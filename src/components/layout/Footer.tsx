import Link from "next/link";
import Logo from "@/components/icons/Logo";

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-discord"
    viewBox="0 0 16 16"
  >
    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
  </svg>
);

const TwitchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-twitch"
    viewBox="0 0 16 16"
  >
    <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z" />
    <path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z" />
  </svg>
);

const KickIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="32" 
    height="32"
    fill="currentColor"
    className="bi bi-kick"
    viewBox="0 0 16 16"
  >
    <path d="M0 0 C331.98 0 663.96 0 1006 0 C1006 331.98 1006 663.96 1006 1006 C674.02 1006 342.04 1006 0 1006 C0 674.02 0 342.04 0 0 Z " fill="#000000" transform="translate(9,9)"/>
    <path d="M0 0 C79.53 0 159.06 0 241 0 C241 52.8 241 105.6 241 160 C267.4 160 293.8 160 321 160 C321 133.6 321 107.2 321 80 C347.4 80 373.8 80 401 80 C401 53.6 401 27.2 401 0 C480.53 0 560.06 0 642 0 C642 79.53 642 159.06 642 241 C615.6 241 589.2 241 562 241 C562 267.4 562 293.8 562 321 C535.6 321 509.2 321 482 321 C482 347.4 482 373.8 482 401 C508.4 401 534.8 401 562 401 C562 427.4 562 453.8 562 481 C588.4 481 614.8 481 642 481 C642 560.53 642 640.06 642 722 C562.47 722 482.94 722 401 722 C401 695.6 401 669.2 401 642 C374.6 642 348.2 642 321 642 C321 615.6 321 589.2 321 562 C294.6 562 268.2 562 241 562 C241 614.8 241 667.6 241 722 C161.47 722 81.94 722 0 722 C0 483.74 0 245.48 0 0 Z " fill="#52FB18" transform="translate(191,151)"/>
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-telegram"
    viewBox="0 0 16 16"
  >
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-twitter"
    viewBox="0 0 16 16"
  >
    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
  </svg>
);

const socialLinks = [
  {
    name: "Discord",
    href: "https://discord.gg/4rMAp8am",
    icon: DiscordIcon,
    brandColorClass: "text-[#5865F2]",
  },
  {
    name: "Twitch",
    href: "https://www.twitch.tv/afterhoursaz",
    icon: TwitchIcon,
    brandColorClass: "text-[#9146FF]",
  },
  {
    name: "Kick",
    href: "https://kick.com/afterhoursaz",
    icon: KickIcon,
    brandColorClass: "text-[#53FC18]",
  },
  // { name: 'Telegram', href: 'https://discord.gg/4rMAp8am', icon: TelegramIcon, brandColorClass: 'text-[#2AABEE]' },
  {
    name: "Twitter",
    href: "https://x.com/atzell69",
    icon: TwitterIcon,
    brandColorClass: "text-primary",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Logo className="h-8 w-auto mr-2" />
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} GamblrNation Hub. All rights reserved.
            </p>
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
