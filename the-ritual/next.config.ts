import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default withNextIntl(nextConfig);
