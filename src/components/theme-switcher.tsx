'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

export default function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsDarkMode(checked);
  };
  
  if (!mounted) {
    // return a placeholder or null to avoid hydration mismatch
    return <div className="h-6 w-11 rounded-full bg-input animate-pulse" />;
  }

  return (
    <Switch
      checked={isDarkMode}
      onCheckedChange={toggleTheme}
      aria-label="Toggle theme"
    />
  );
}
