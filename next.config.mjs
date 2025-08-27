/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // 行业标准优化配置
  experimental: {
    fetchCache: 'default-cache', // 启用全局fetch缓存
  },
  // 启用静态优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 生产环境移除console.log
  },
  // CDN和缓存头优化
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1年缓存静态资源
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=300', // API缓存5分钟
          },
        ],
      },
    ];
  },
};

export default nextConfig;