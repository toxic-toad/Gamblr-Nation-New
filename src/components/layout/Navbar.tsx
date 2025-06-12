
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Gamepad2, UserCircle, LogIn, Gem, DollarSign, Trophy, ShoppingCart, PlayCircle, Gift } from 'lucide-react'; 
import { useState } from 'react';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useJackpot } from '@/context/JackpotContext'; 

const navItems = [
  { name: 'Games', href: '/games', icon: Gamepad2 },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
  { name: 'Live Stream', href: '/live-stream', icon: PlayCircle },
  { name: 'Daily Case', href: '/daily-case', icon: Gift },
];

const mobileNavItems = [
  ...navItems,
  { name: 'Jackpot', href: '/progressive-jackpot', icon: Gem },
];


const NavLink = ({ href, children, onClick, icon: Icon, isActiveOverride }: { href: string; children: React.ReactNode; onClick?: () => void; icon?: React.ElementType; isActiveOverride?: boolean }) => {
  const pathname = usePathname();
  const isActive = isActiveOverride !== undefined ? isActiveOverride : pathname === href;

  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn(
          "text-sm font-medium transition-colors group", 
          isActive ? "text-primary font-bold" : "text-foreground/80",
          "flex items-center gap-2 justify-start lg:justify-center px-2 py-1 lg:px-3 lg:py-2 w-full" // Added w-full for consistency in sheet
        )}
        aria-current={isActive ? "page" : undefined}
      >
        {Icon && <Icon className={cn(
            "h-4 w-4 transition-colors",
            isActive ? "text-primary" : "text-accent",
            !isActive && "group-hover:text-accent-foreground" 
          )} />}
        {children}
      </Button>
    </Link>
  );
};

function LiveJackpotDisplay() {
  const { jackpotAmount } = useJackpot();
  const pathname = usePathname();
  const isActive = pathname === "/progressive-jackpot";

  return (
    <Link href="/progressive-jackpot" passHref>
      <Button
        variant="ghost"
        className={cn(
          "text-sm font-medium transition-colors group px-2 py-1 lg:px-3 lg:py-2 flex items-center gap-1.5", 
          isActive ? "text-primary font-bold bg-primary/10" : "text-foreground/80"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <DollarSign className={cn(
            "h-4 w-4 transition-colors", 
            isActive ? "text-primary" : "text-accent",
            !isActive && "group-hover:text-accent-foreground" 
            )}
        />
        
        <span className="hidden lg:inline text-foreground/80">Jackpot:</span>

        <span className={cn(
          "font-semibold", 
          isActive ? "text-primary" : "text-accent", 
          !isActive && "group-hover:text-accent-foreground" 
          )}>
            {jackpotAmount.toLocaleString()}
        </span>
      </Button>
    </Link>
  );
}


export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isLoading } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-10 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center">
          <nav className="flex flex-wrap items-center gap-x-1 lg:gap-x-2 gap-y-1">
            {navItems.map((item) => (
              <NavLink key={item.name} href={item.href} icon={item.icon}>
                {item.name}
              </NavLink>
            ))}
            <LiveJackpotDisplay />
          </nav>
          <div className="ml-2 lg:ml-4 flex items-center">
            {isLoading ? (
              <div className="h-9 w-9 bg-muted rounded-full animate-pulse"></div> 
            ) : currentUser ? (
              <Link href="/profile" passHref>
                <Button variant="ghost" className={cn("p-0 hover:bg-transparent", pathname === '/profile' ? 'ring-2 ring-primary rounded-full' : '')}>
                  <Avatar className={cn("h-9 w-9 border-2", pathname === '/profile' ? 'border-primary' : 'border-transparent hover:border-primary/50')}>
                    {currentUser.profileImageUrl ? (
                      <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.username || 'User'} />
                    ) : null}
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5"/>}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            ) : (
              <NavLink href="/login" icon={LogIn} isActiveOverride={pathname === '/login' || pathname === '/signup'}>
                Login
              </NavLink>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Logo className="h-10 w-auto" />
                  </Link>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-6 w-6 text-primary" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                  </SheetClose>
                </div>
                <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                  {mobileNavItems.map((item) => ( 
                    <NavLink key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} icon={item.icon}>
                      {item.name}
                    </NavLink>
                  ))}
                  <hr className="my-3 border-border/40" />
                  {isLoading ? (
                     <div className="h-8 w-full bg-muted rounded animate-pulse px-2 py-1"></div>
                  ) : currentUser ? (
                     <Link href="/profile" passHref>
                        <Button
                            variant="ghost"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "text-sm font-medium transition-colors group w-full",
                                pathname === '/profile' ? "text-primary font-bold" : "text-foreground/80",
                                "flex items-center gap-2 justify-start px-2 py-1"
                            )}
                            aria-current={pathname === '/profile' ? "page" : undefined}
                        >
                            <Avatar className={cn("h-6 w-6", pathname === '/profile' ? 'ring-1 ring-primary' : '')}>
                                {currentUser.profileImageUrl ? (
                                    <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.username || 'User'} />
                                ) : null}
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                    {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : <UserCircle className="h-3 w-3" />}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{currentUser.username || 'Profile'}</span>
                        </Button>
                    </Link>
                  ) : (
                     <NavLink href="/login" onClick={() => setMobileMenuOpen(false)} icon={LogIn} isActiveOverride={pathname === '/login' || pathname === '/signup'}>
                        Login
                      </NavLink>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
