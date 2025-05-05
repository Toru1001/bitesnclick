import { NextConfig } from 'next';

const config: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imdktcworfdyqonfdoev.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
  },
  
};

export default config;
