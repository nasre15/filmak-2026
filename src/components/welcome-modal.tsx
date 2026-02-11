'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function WelcomeModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This code runs only on the client side.
    const hasVisited = localStorage.getItem('filmak_has_visited');
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem('filmak_has_visited', 'true');
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-lg border-primary/20 shadow-2xl shadow-primary/20 text-center p-8 m-4">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-white mb-4">
            {t('welcomeModal.title', 'مرحباً بك في فلمك بيطا 2026')}
          </DialogTitle>
          <DialogDescription className="text-foreground/80 text-lg">
            {t('welcomeModal.body', 'اكتشف عالم الأفلام، الأنمي، والرياضة بجودة عالية. اطلب أفلامك المفضلة عبر التلجرام وادعم مشروعنا بالبيتكوين.')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-6">
          <Button
            type="button"
            size="lg"
            className="w-full h-14 text-xl"
            onClick={() => setIsOpen(false)}
          >
            {t('welcomeModal.button', 'ابدأ المشاهدة الآن')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
