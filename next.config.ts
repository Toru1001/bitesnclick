import { NextConfig } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const config: NextConfig = {
  
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseUrl.replace(/^https?:\/\//, ''),
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
  },
  
};

export default config;
