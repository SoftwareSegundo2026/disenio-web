'use client';

import { Thermometer, Zap, Flame, Droplets, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Heating() {
  const t = useTranslations('HeatingPage');

  const kettles = [
    {
      name: "Precision Obsidian",
      type: "Electric",
      temp: "40°C - 100°C",
      price: "$129",
      features: ["Digital Control", "Strix Controller", "Gooseneck Spout"],
      image: "/images/shared/precision-kettle.jpg"
    },
    {
      name: "Estancia Chrome",
      type: "Electric",
      temp: "Fixed 80°C",
      price: "$89",
      features: ["One-Touch Mate Mode", "Fast Boil", "Auto Shut-off"],
      image: "/images/shared/techniques-card.jpg"
    },
    {
      name: "Ritual Cream",
      type: "Electric",
      temp: "Analog Dial",
      price: "$110",
      features: ["Vintage Design", "Temperature Gauge", "Cordless Base"],
      image: "/images/gourds/gourd-wood.jpg"
    }
  ];

  return (
    <div className="pb-20 max-w-7xl mx-auto px-6 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700">
      <header className="mb-16 md:mb-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-primary"></div>
          <span className="text-secondary font-bold text-xs uppercase tracking-widest">{t('header.tag')}</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl text-primary tracking-tight mb-6">{t('header.title')}</h1>
        <p className="max-w-2xl text-lg text-on-surface-variant font-body leading-relaxed">
          {t('header.description')}
        </p>
      </header>

      <section className="mb-32">
        <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-12 flex flex-col justify-center">
            <h2 className="font-headline text-4xl text-primary mb-6 italic">{t('golden_range.title')}</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-primary">
                  <Thermometer className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-headline text-2xl text-primary">{t('golden_range.optimal.temp')}</h3>
                  <p className="text-on-surface-variant text-sm">{t('golden_range.optimal.description')}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                  <Droplets className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-headline text-2xl text-primary">{t('golden_range.oxygenation.title')}</h3>
                  <p className="text-on-surface-variant text-sm">{t('golden_range.oxygenation.description')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative min-h-100">
            <img
              alt="Water boiling for mate"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              src="/images/shared/water-elements.jpg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-r from-surface-container-low/80 to-transparent lg:block hidden"></div>
          </div>
        </div>
      </section>

      <section className="mb-32">
        <h2 className="font-headline text-4xl text-primary mb-12">{t('precision.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {kettles.map((kettle, index) => (
            <div
              key={kettle.name}
              className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/5 hover:border-primary/20 transition-all group motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700"
              style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'backwards' }}
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-6 bg-surface-container">
                <img
                  alt={kettle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src={kettle.image}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline text-2xl text-primary">{kettle.name}</h3>
                <span className="text-secondary font-bold text-lg">{kettle.price}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3 h-3 text-outline-variant" />
                <span className="text-xs text-outline-variant uppercase tracking-widest">{kettle.type} • {kettle.temp}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {kettle.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <ShieldCheck className="w-4 h-4 text-primary/40" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-background transition-all">
                {t('precision.cta')}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-primary text-background p-12 rounded-2xl relative overflow-hidden group">
          <Flame className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          <h2 className="font-headline text-4xl mb-6">{t('fire_kettles.title')}</h2>
          <p className="opacity-80 text-lg leading-relaxed mb-8">
            {t('fire_kettles.description')}
          </p>
          <div className="flex items-center gap-2 font-bold cursor-pointer group">
            <span>{t('fire_kettles.explore')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
        <div className="bg-surface-container-highest p-12 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="font-headline text-4xl text-primary mb-6">{t('termo.title')}</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
              {t('termo.description')}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-background rounded-full text-xs font-bold text-primary border border-outline-variant/20">{t('termo.features.double_wall')}</div>
            <div className="px-4 py-2 bg-background rounded-full text-xs font-bold text-primary border border-outline-variant/20">{t('termo.features.bpa_free')}</div>
            <div className="px-4 py-2 bg-background rounded-full text-xs font-bold text-primary border border-outline-variant/20">{t('termo.features.heat_12h')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
