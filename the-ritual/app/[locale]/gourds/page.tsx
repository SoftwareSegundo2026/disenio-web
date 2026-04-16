'use client';

import { Droplets, Wind, Sparkles, CheckCircle2, ShieldCheck, Thermometer } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Gourds() {
  const t = useTranslations('GourdsPage');

  return (
    <div className="pb-20 max-w-7xl mx-auto px-6 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700">
      <header className="mb-16 md:mb-24">
        <h1 className="font-headline text-5xl md:text-7xl text-primary tracking-tight mb-6">{t('header.title')}</h1>
        <p className="max-w-2xl text-lg text-on-surface-variant font-body leading-relaxed">
          {t('header.description')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <section className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden p-8 flex flex-col md:flex-row gap-8 transition-all hover:bg-surface-container duration-500 group">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-xs font-bold rounded-full uppercase tracking-widest">{t('calabaza.tag')}</div>
            <h2 className="font-headline text-4xl text-primary">{t('calabaza.title')}</h2>
            <p className="text-on-surface-variant leading-relaxed">{t('calabaza.description')}</p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <Droplets className="text-secondary w-5 h-5 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-primary">{t('calabaza.curing.title')}</h4>
                  <p className="text-xs text-on-surface-variant">{t('calabaza.curing.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="text-secondary w-5 h-5 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-primary">{t('calabaza.maintenance.title')}</h4>
                  <p className="text-xs text-on-surface-variant">{t('calabaza.maintenance.description')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-auto min-h-75">
            <img
              alt={t('calabaza.title')}
              className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-700"
              src="/images/gourds/gourd-calabaza.jpg"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        <section className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between transition-all hover:bg-surface-container duration-500 border border-outline-variant/10">
          <div className="space-y-4">
            <h2 className="font-headline text-3xl text-primary">{t('madera.title')}</h2>
            <p className="text-sm text-on-surface-variant">{t('madera.description')}</p>
            <div className="h-48 overflow-hidden rounded-lg">
              <img
                alt={t('madera.title')}
                className="w-full h-full object-cover"
                src="/images/gourds/gourd-wood.jpg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="mt-6 p-4 bg-surface-container rounded-lg border-l-4 border-secondary">
            <h4 className="font-bold text-xs text-secondary uppercase tracking-tighter mb-1">{t('madera.care.title')}</h4>
            <p className="text-xs text-on-surface-variant leading-snug">{t('madera.care.description')}</p>
          </div>
        </section>

        <section className="md:col-span-5 bg-surface-container-low rounded-xl p-8 flex flex-col transition-all hover:bg-surface-container duration-500">
          <div className="grow">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-headline text-3xl text-primary">{t('ceramica.title')}</h2>
              <ShieldCheck className="text-outline-variant w-6 h-6" />
            </div>
            <p className="text-on-surface-variant mb-6 italic">{t('ceramica.quote')}</p>
            <img
              alt={t('ceramica.title')}
              className="w-full h-56 object-cover rounded-xl mb-6 shadow-sm"
              src="/images/gourds/gourd-ceramic.jpg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-surface-container p-3 rounded-lg">
              <span className="font-bold block mb-1">{t('ceramica.curing')}</span>
              {t('ceramica.curing_desc')}
            </div>
            <div className="bg-surface-container p-3 rounded-lg">
              <span className="font-bold block mb-1">{t('ceramica.pros')}</span>
              {t('ceramica.pros_desc')}
            </div>
          </div>
        </section>

        <section className="md:col-span-7 bg-primary text-background rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xl">
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="font-headline text-4xl mb-4">{t('silicona.title')}</h2>
            <p className="opacity-80 mb-8 leading-relaxed">{t('silicona.description')}</p>
            <ul className="space-y-3">
              {(t.raw('silicona.features') as string[]).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-tertiary-fixed w-4 h-4" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto bg-[#1c3c21]">
            <img
              alt={t('silicona.title')}
              className="w-full h-full object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
              src="/images/gourds/gourd-silicone.jpg"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>
      </div>

      <div className="mt-24 p-12 bg-surface-container rounded-4xl border border-outline-variant/10 text-center relative overflow-hidden">
        <h3 className="font-headline text-4xl text-primary mb-6">{t('golden_rule.title')}</h3>
        <p className="max-w-2xl mx-auto text-on-surface-variant mb-10 text-lg">
          {t('golden_rule.description')}
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 bg-background p-4 rounded-full shadow-sm">
            <Thermometer className="text-secondary w-5 h-5" />
            <span className="font-bold text-sm">{t('golden_rule.no_boiling')}</span>
          </div>
          <div className="flex items-center gap-2 bg-background p-4 rounded-full shadow-sm">
            <Wind className="text-secondary w-5 h-5" />
            <span className="font-bold text-sm">{t('golden_rule.air_dry')}</span>
          </div>
          <div className="flex items-center gap-2 bg-background p-4 rounded-full shadow-sm">
            <Sparkles className="text-secondary w-5 h-5" />
            <span className="font-bold text-sm">{t('golden_rule.no_detergents')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
