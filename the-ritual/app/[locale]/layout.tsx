import type { Metadata } from 'next';
import { Noto_Serif, Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '700', '800'],
});

export const metadata: Metadata = {
  title: 'The Ritual of Connection',
  description: 'Explore the ancient art of yerba mate: techniques, gourds, and heritage.',
  icons: {
    icon: [
      { url: '/icons/icons8-mate-neon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icons8-mate-neon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icons8-mate-neon-96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/icons/icons8-mate-neon-32.png',
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${notoSerif.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background text-on-surface font-body antialiased flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="grow pt-20">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
