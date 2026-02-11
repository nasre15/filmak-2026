'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full text-center p-8 text-muted-foreground text-sm">
      <div className="flex items-center justify-center gap-4">
        <span>© 2026 فلمك بيطا</span>
        <Link href="/about" className="hover:text-foreground transition-colors">
          {t('nav.about', 'من نحن')}
        </Link>
      </div>
    </footer>
  );
}
