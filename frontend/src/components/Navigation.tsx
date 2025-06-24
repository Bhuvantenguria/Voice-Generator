'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X, Home, Mic2, Settings, Info, Crown, Volume2, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ThemeSwitcher } from './ui/theme-switcher';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/generate', label: 'Generate Voice', icon: Mic2 },
    { href: '/dashboard', label: 'Dashboard', icon: Volume2, auth: true },
    { href: '/profile', label: 'Profile', icon: Settings, auth: true },
    { href: '/about', label: 'About', icon: Info },
  ];

  const toggleDrawer = () => setIsOpen(!isOpen);

  const renderAuthButton = () => (
    <SignedOut>
      <Link href="/sign-in">
        <Button variant="outline" size="sm" className="hidden md:flex">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </Link>
    </SignedOut>
  );

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const Icon = item.icon;
    if (item.auth) {
      return (
        <SignedIn key={item.href}>
          <Link
            href={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
              ${pathname === item.href 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
              }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        </SignedIn>
      );
    }
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
          ${pathname === item.href 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-accent'
          }`}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-lg hover:bg-accent md:hidden"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl hidden sm:inline-block">VoiceGen</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map(renderMenuItem)}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              {renderAuthButton()}
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-background border-r z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                      <Crown className="h-6 w-6 text-primary" />
                      <span className="font-bold text-xl">VoiceGen</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleDrawer}
                      className="md:hidden"
                    >
                      <X size={24} />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const menuItem = (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={toggleDrawer}
                        className={`flex items-center space-x-3 px-6 py-3 transition-colors
                          ${pathname === item.href 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-accent'
                          }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                    return item.auth ? (
                      <SignedIn key={item.href}>{menuItem}</SignedIn>
                    ) : menuItem;
                  })}
                  <SignedOut>
                    <div className="px-6 py-3">
                      <Link href="/sign-in" className="w-full">
                        <Button className="w-full">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  </SignedOut>
                </div>

                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <ThemeSwitcher />
                    <SignedIn>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content Padding */}
      <div className="h-16" />
    </>
  );
};

export default Navigation; 