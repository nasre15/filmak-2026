import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import I18nClientProvider from '@/components/i18n-client-provider';

export const metadata: Metadata = {
  title: 'Filmak - Your Ultimate Streaming Hub',
  description: 'Watch the latest movies, anime, and sports for free on Filmak with high quality and Arabic subtitles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen')}>
        <I18nClientProvider>
          {children}
          <Toaster />
        </I18nClientProvider>
      </body>
    </html>
  );
}
