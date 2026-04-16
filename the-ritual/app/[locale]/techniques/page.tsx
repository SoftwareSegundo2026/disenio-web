'use client';

import { Thermometer, Waves } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Techniques() {
  const t = useTranslations('TechniquesPage');

  const styles = [
    {
      title: t('variants.amargo.title'),
      description: t('variants.amargo.description'),
      image: "/images/techniques/technique-amargo.jpg"
    },
    {
      title: t('variants.dulce.title'),
      description: t('variants.dulce.description'),
      image: "/images/techniques/technique-dulce.jpg"
    },
    {
      title: t('variants.terere.title'),
      description: t('variants.terere.description'),
      image: "/images/techniques/technique-terere.jpg"
    },
    {
      title: t('variants.yuyos.title'),
      description: t('variants.yuyos.description'),
      image: "/images/techniques/technique-yuyos.jpg"
    }
  ];

  return (
    <div className="pb-20 px-6 max-w-7xl mx-auto motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700">
      <header className="mb-16 md:mb-24 flex flex-col md:flex-row items-end gap-8">
        <div className="flex-1">
          <span className="font-body text-secondary font-bold uppercase tracking-widest text-xs mb-4 block">{t('header.tag')}</span>
          <h1 className="font-headline text-5xl md:text-7xl text-primary leading-tight tracking-tight mb-6">{t('header.title')}</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {t('header.description')}
          </p>
        </div>
        <div className="w-full md:w-1/3 rounded-xl overflow-hidden editorial-shadow bg-surface-container-high relative aspect-video">
          <img
            alt={t('header.title')}
            className="w-full h-full object-cover inner-glow"
            src="/images/shared/precision-kettle.jpg"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-6 left-6 right-6 p-4 glass-nav rounded-lg">
            <p className="font-headline italic text-primary text-sm">{t('header.quote')}</p>
          </div>
        </div>
      </header>

      <section className="mb-24 grid md:grid-cols-2 gap-12 items-center bg-surface-container rounded-xl p-8 md:p-12">
        <div>
          <h2 className="font-headline text-3xl text-primary mb-6">{t('secret.title')}</h2>
          <p className="text-on-surface-variant leading-relaxed mb-8">
            {t('secret.description')}
          </p>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-tertiary-fixed" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle
                  className="text-primary motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-700"
                  cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="50" strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline text-xl text-primary">80°</div>
            </div>
            <div>
              <span className="block font-bold text-primary font-body uppercase text-xs tracking-wider">{t('secret.steeping_point.label')}</span>
              <p className="text-sm text-secondary italic">{t('secret.steeping_point.description')}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background p-6 rounded-lg text-center editorial-shadow">
            <Thermometer className="text-primary w-8 h-8 mx-auto mb-2" />
            <h3 className="font-bold text-sm">{t('secret.thermometer')}</h3>
            <p className="text-xs text-on-surface-variant mt-2">{t('secret.thermometer_desc')}</p>
          </div>
          <div className="bg-background p-6 rounded-lg text-center editorial-shadow translate-y-4">
            <Waves className="text-primary w-8 h-8 mx-auto mb-2" />
            <h3 className="font-bold text-sm">{t('secret.flow')}</h3>
            <p className="text-xs text-on-surface-variant mt-2">{t('secret.flow_desc')}</p>
          </div>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="font-headline text-4xl text-primary mb-12 text-center">{t('variants.title')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {styles.map((style, index) => (
            <div
              key={style.title}
              className="group motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700"
              style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'backwards' }}
            >
              <div className="aspect-3/4 rounded-xl overflow-hidden mb-6 bg-surface-container-low transition-transform duration-500 group-hover:-translate-y-2">
                <img
                  alt={style.title}
                  className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-500"
                  src={style.image}
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-headline text-2xl text-primary mb-2">{style.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{style.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-primary text-background p-12 rounded-xl flex flex-col justify-center">
            <h2 className="font-headline text-4xl mb-6">{t('inclination.title')}</h2>
            <p className="text-tertiary-fixed leading-relaxed text-lg mb-8">
              {t('inclination.description')}
            </p>
            <button className="bg-linear-to-r from-primary to-primary-container text-background px-8 py-3 rounded-full font-bold self-start hover:scale-105 transition-all">
              {t('inclination.cta')}
            </button>
          </div>
          <div className="bg-secondary-fixed p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <Waves className="text-on-secondary-fixed w-12 h-12 mb-4" />
            <h3 className="font-headline text-2xl text-on-secondary-fixed mb-2">{t('slow_pour.title')}</h3>
            <p className="text-on-secondary-fixed-variant text-sm">{t('slow_pour.description')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
