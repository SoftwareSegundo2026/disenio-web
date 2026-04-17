'use client';

import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import TypewriterText from '../../components/TypewriterText';

export default function Home() {
  const t = useTranslations('HomePage');
  const heroTitle = t.raw('hero.title').replace(/<[^>]*>/g, '');

  return (
    <div className="pb-20 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700">
      <section className="max-w-7xl mx-auto px-8 mb-20">
        <div className="relative rounded-xl overflow-hidden min-h-150 flex items-end">
          <img
            alt={heroTitle}
            className="absolute inset-0 w-full h-full object-cover"
            src="/images/home/home-hero.jpg"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="relative z-10 p-12 w-full max-w-3xl">
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl text-white mb-6 leading-tight -tracking-[0.02em] min-h-[1.2em]">
              <TypewriterText text={heroTitle} />
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-body max-w-xl mb-8 leading-relaxed motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-300">
              {t('hero.description')}
            </p>
            <div className="flex gap-4">
              <Link href="/techniques">
                <button className="bg-linear-to-br from-primary to-primary-container text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-xl active:scale-95 transition-all">
                  {t('hero.cta_start')}
                </button>
              </Link>
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-white/20 transition-all border border-white/20">
                {t('hero.cta_heritage')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-150">
          <Link href="/techniques" className="md:col-span-7 bg-surface-container-low rounded-xl p-10 flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:bg-surface-container-high relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-4 block">{t('sections.method.tag')}</span>
              <h2 className="font-headline text-4xl text-primary mb-4">{t('sections.method.title')}</h2>
              <p className="text-on-surface-variant font-body max-w-sm mb-6 leading-relaxed">
                {t('sections.method.description')}
              </p>
              <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm mr-2">{t('sections.method.link')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-80 h-80 opacity-20 group-hover:scale-110 transition-transform duration-700">
              <img
                alt="Techniques"
                className="w-full h-full object-cover rounded-full"
                src="/images/shared/techniques-card.jpg"
                referrerPolicy="no-referrer"
              />
            </div>
          </Link>

          <Link href="/gourds" className="md:col-span-5 bg-tertiary-fixed rounded-xl p-10 flex flex-col group cursor-pointer transition-all duration-500 relative overflow-hidden">
            <div className="relative z-10 flex-1">
              <span className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-4 block">{t('sections.vessels.tag')}</span>
              <h2 className="font-headline text-4xl text-primary mb-4">{t('sections.vessels.title')}</h2>
              <p className="text-on-surface-variant font-body mb-6 leading-relaxed">
                {t('sections.vessels.description')}
              </p>
            </div>
            <div className="relative z-10 mt-auto flex justify-between items-end">
              <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm mr-2">{t('sections.vessels.link')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 w-48 h-48 bg-surface/30 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          </Link>

          <Link href="/heating" className="md:col-span-12 bg-surface-container rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 group cursor-pointer transition-all duration-500 hover:bg-surface-container-highest">
            <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden relative">
              <img
                alt="Water Elements"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                src="/images/shared/water-elements.jpg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 block">{t('sections.water.tag')}</span>
              <h2 className="font-headline text-3xl text-primary mb-3">{t('sections.water.title')}</h2>
              <p className="text-on-surface-variant font-body max-w-xl mb-4 leading-relaxed">
                {t('sections.water.description')}
              </p>
              <div className="flex items-center text-primary font-bold">
                <span className="text-sm mr-2">{t('sections.water.link')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 mb-32">
        <div className="bg-surface-container-low rounded-xl p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <h2 className="font-headline text-4xl text-primary mb-6 italic">{t('steep.title')}</h2>
            <p className="text-on-surface-variant font-body text-lg leading-relaxed mb-8">
              {t('steep.description')}
            </p>
            <button className="bg-secondary-fixed text-on-secondary-fixed px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
              {t('steep.cta')}
            </button>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64 -rotate-90">
              <circle className="text-tertiary-fixed" cx="128" cy="128" fill="transparent" r="100" stroke="currentColor" strokeWidth="28"></circle>
              <circle
                className="text-primary motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-700"
                cx="128" cy="128" fill="transparent" r="100" stroke="currentColor" strokeDasharray="628" strokeDashoffset="150" strokeLinecap="round" strokeWidth="28"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-5xl text-on-surface">03:45</span>
              <span className="font-body text-xs uppercase tracking-tighter text-outline-variant">{t('steep.status')}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-8 right-8">
        <button className="w-16 h-16 bg-primary-container text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform active:scale-95 group">
          <img
            alt={t('brewing.label')}
            className="w-8 h-8 invert"
            src="/icons/mate.png"
          />
          <span className="absolute right-full mr-4 bg-on-surface text-background text-xs font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {t('brewing.label')}
          </span>
        </button>
      </div>
    </div>
  );
}

