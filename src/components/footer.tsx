'use client';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full text-center p-8 text-muted-foreground text-sm">
      {t('homePage.footer')}
    </footer>
  );
}
