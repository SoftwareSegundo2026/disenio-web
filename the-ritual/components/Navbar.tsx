'use client';

import { usePathname, useRouter, Link } from '@/i18n/routing';
import { Search, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navbar');
  const locale = useLocale();

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/techniques', label: t('techniques') },
    { href: '/gourds', label: t('gourds') },
    { href: '/heating', label: t('heating') },
  ];

  const toggleLanguage = (newLocale: 'en' | 'es') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-outline-variant/10">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-headline tracking-tight text-primary">
          The Ritual
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={cn(
                  "text-sm font-body transition-colors duration-300",
                  isActive ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-secondary hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center space-x-2 mr-2">
            <button 
              onClick={() => toggleLanguage('es')}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full transition-all text-xl",
                locale === 'es' ? "bg-primary/10 grayscale-0 scale-110" : "grayscale opacity-50 hover:opacity-100 hover:grayscale-0"
              )}
              title="Español"
            >
              🇦🇷
            </button>
            <button 
              onClick={() => toggleLanguage('en')}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full transition-all text-xl",
                locale === 'en' ? "bg-primary/10 grayscale-0 scale-110" : "grayscale opacity-50 hover:opacity-100 hover:grayscale-0"
              )}
              title="English"
            >
              🇺🇸
            </button>
          </div>

          <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-1.5">
            <Search className="text-outline-variant w-4 h-4 mr-2" />
            <input 
              className="bg-transparent border-none focus:ring-0 text-xs w-32 font-body placeholder:text-outline-variant" 
              placeholder={t('search')} 
              type="text"
            />
          </div>
          <button className="p-2 hover:bg-surface-container rounded-full transition-all">
            <Settings className="text-primary w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full transition-all">
            <UserCircle className="text-primary w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
