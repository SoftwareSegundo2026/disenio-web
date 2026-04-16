import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-surface-container text-primary mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 border-t border-outline-variant/15 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-0">
          <div className="text-lg font-headline text-primary mb-2">The Ritual</div>
          <p className="font-headline italic text-sm text-secondary">
            {t('rights')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-secondary hover:text-primary transition-colors font-headline italic text-sm" href="#">{t('links.philosophy')}</a>
          <a className="text-secondary hover:text-primary transition-colors font-headline italic text-sm" href="#">{t('links.heritage')}</a>
          <a className="text-secondary hover:text-primary transition-colors font-headline italic text-sm" href="#">{t('links.sustainability')}</a>
          <a className="text-secondary hover:text-primary transition-colors font-headline italic text-sm" href="#">{t('links.contact')}</a>
        </div>
      </div>
    </footer>
  );
}
