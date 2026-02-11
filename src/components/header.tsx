'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import {
  Bell,
  Clapperboard,
  Compass,
  Menu,
  ChevronDown,
  Bomb,
  Film,
  Smile,
  Gavel,
  Camera,
  Drama,
  Users,
  Sparkles,
  ScrollText,
  Ghost,
  Music2,
  KeyRound,
  Heart,
  Rocket,
  Tv,
  Spline,
  Shield,
  Sun,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

import LanguageSwitcher from './language-switcher';
import SearchBar from './search-bar';
import { ALL_GENRES } from '@/lib/genres';
import { Separator } from './ui/separator';

function GenresMenu() {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center"
        >
          {t('nav.genres')}
          <ChevronDown className="h-4 w-4 ms-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <ScrollArea className="h-72">
          <div className="p-1">
            {ALL_GENRES.map((genre) => (
              <DropdownMenuItem key={genre.id} asChild>
                <Link href={`/explore?genre=${genre.id}`}>
                  {t(`genres.${genre.name.replace(/ /g, '')}`, genre.name)}
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dir = i18n.dir();

  const mainNavLinks = [
    { key: 'home', label: t('nav.home'), href: '/' },
    { key: 'explore', label: t('nav.explore'), href: '/explore', icon: Compass },
  ];

  const genreIcons: { [key: string]: React.ElementType } = {
    Action: Bomb,
    Adventure: Compass,
    Animation: Film,
    Comedy: Smile,
    Crime: Gavel,
    Documentary: Camera,
    Drama: Drama,
    Family: Users,
    Fantasy: Sparkles,
    History: ScrollText,
    Horror: Ghost,
    Music: Music2,
    Mystery: KeyRound,
    Romance: Heart,
    'Science Fiction': Rocket,
    'TV Movie': Tv,
    Thriller: Spline,
    War: Shield,
    Western: Sun,
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 md:px-8 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300">
      <div className="flex items-center gap-4 lg:gap-8">
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('header.openMenu', 'Open menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-64 p-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <nav className="flex flex-col gap-4">
                    {mainNavLinks.map((link) => (
                      <SheetClose asChild key={link.key}>
                        <Link href={link.href} className="text-lg font-medium">
                          <span dir="auto">{link.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link href="/admin" className="text-lg font-medium text-foreground/80 hover:text-foreground">
                        <span dir="auto">{t('nav.admin')}</span>
                      </Link>
                    </SheetClose>
                  </nav>
                  <Separator className="my-4" />
                  <h3 className="text-lg font-semibold mb-2" dir="auto">{t('nav.genres')}</h3>
                  <nav className="flex flex-col gap-2">
                    {ALL_GENRES.map((genre) => {
                      const Icon = genreIcons[genre.name];
                      return (
                        <SheetClose asChild key={genre.id}>
                          <Link href={`/explore?genre=${genre.id}`} className="flex items-center gap-3 text-base text-foreground/80 hover:text-foreground">
                            {Icon && <Icon className="h-5 w-5" />}
                            <span dir="auto">{t(`genres.${genre.name.replace(/ /g, '')}`, genre.name)}</span>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Clapperboard className="h-7 w-7" />
          <h1 className="hidden md:block">StreamVerse</h1>
        </Link>
        <nav className="hidden lg:flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/explore" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            <Compass className="h-4 w-4" />
            {t('nav.explore')}
          </Link>
          <GenresMenu />
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
