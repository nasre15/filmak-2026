'use client';
import { useTranslation } from 'react-i18next';

export default function NoMoviesFound() {
  const { t } = useTranslation();
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{t('homePage.noMovies')}</h2>
        <p className="text-muted-foreground mt-2">
          {t('homePage.tryAddingMovies')}
        </p>
      </div>
    </div>
  );
}
