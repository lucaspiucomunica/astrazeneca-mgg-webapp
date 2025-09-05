/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de cache para assets estáticos
  async headers() {
    return [
      {
        // Cache para imagens, vídeos e áudios
        source: '/(.*\\.(png|jpg|jpeg|gif|webp|svg|ico|mp3|mp4|webm|ogg|wav))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 ano
          },
        ],
      },
      {
        // Cache para arquivos estáticos
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache para CSS e JS
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Otimizações para produção
  compress: true,
  poweredByHeader: false,
  
  // Configurações para Kiosker.IO
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
