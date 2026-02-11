'use client';

import Link from 'next/link';
import { Bell, Clapperboard, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LanguageSwitcher from './language-switcher';
import { useTranslation } from 'react-i18next';
import SearchBar from './search-bar';

export default function Header() {
  const { t } = useTranslation();
  const navLinks = [
    { key: 'home', label: t('nav.home'), href: '/' },
    { key: 'tv_shows', label: t('nav.tv_shows'), href: '#' },
    { key: 'movies', label: t('nav.movies'), href: '#' },
    { key: 'new_popular', label: t('nav.new_popular'), href: '#' },
    { key: 'my_list', label: t('nav.my_list'), href: '#' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 md:px-8 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Clapperboard className="h-7 w-7" />
          <h1 className="hidden md:block">StreamVerse</h1>
        </Link>
        <nav className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link key={link.key} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
           <Link href="/explore" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            <Grid className="h-4 w-4" />
            {t('nav.explore')}
          </Link>
          <Link href="/admin" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {t('nav.admin')}
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <SearchBar />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">{t('header.notifications')}</span>
        </Button>
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User avatar" data-ai-hint="person face" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t('userMenu.user')}</p>
                <p className="text-xs leading-none text-muted-foreground">{t('userMenu.email')}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('userMenu.profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('userMenu.billing')}</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">{t('userMenu.settings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('userMenu.logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
