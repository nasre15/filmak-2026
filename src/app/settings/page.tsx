'use client';
export const dynamic = 'force-dynamic';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/theme-switcher';
import LanguageSelect from '@/components/language-select';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        <Link href="/" className="mb-4 inline-block">
          <Button variant="ghost">
            <ArrowLeft className="me-2 h-4 w-4" />
            {t('settings.backToHome', 'Back to Home')}
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.title', 'Settings')}</CardTitle>
            <CardDescription>
              {t('settings.description', 'Manage your account settings.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Profile Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t('settings.profile.title', 'Profile')}
              </h3>
              <Separator />
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src="https://picsum.photos/seed/avatar/100/100"
                    data-ai-hint="person face"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Filmak User</p>
                  <p className="text-sm text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t('settings.preferences.title', 'Preferences')}
              </h3>
              <Separator />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('settings.preferences.language', 'Language')}
                  </label>
                  <LanguageSelect />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('settings.preferences.theme.title', 'Theme')}
                  </label>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <p className="text-sm text-muted-foreground">
                      {t(
                        'settings.preferences.theme.description',
                        'Toggle between light and dark mode.'
                      )}
                    </p>
                    <ThemeSwitcher />
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t('settings.subscription.title', 'Subscription')}
              </h3>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t(
                    'settings.subscription.currentPlan',
                    'Current plan:'
                  )}
                </p>
                <p className="font-semibold text-primary">Premium</p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="space-y-2 pt-4">
              <Separator />
              <Button variant="destructive" className="w-full">
                {t('settings.logout', 'Logout')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
