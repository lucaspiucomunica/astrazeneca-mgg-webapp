'use client';

import { useEffect, useRef } from 'react';

/**
 * Componente para gerenciar cache de assets no Kiosker.IO
 * Pre-carrega todos os assets críticos para evitar re-download
 */
const AssetCache = () => {
  const preloadedAssets = useRef(new Set());

  useEffect(() => {
    // Lista de todos os assets que precisam ser pré-carregados
    const assets = [
      // Vídeos
      '/video/miastenia-gravis-hero.webm',
      '/video/miastenia-gravis.webm',
      
      // Áudios
      '/audio/guilherme.mp3',
      '/audio/kenia.mp3',
      
      // Imagens
      '/images/thumb-video-hero.webp',
      '/images/logo-AMMI.webp',
      '/images/logo-abrami.webp',
      '/images/logo-afag.webp',
      '/images/logo-casahunter.webp',
      '/images/qr-code.png',
    ];

    // Função para pré-carregar um asset
    const preloadAsset = (url) => {
      if (preloadedAssets.current.has(url)) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        
        // Determinar o tipo de asset
        if (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg')) {
          link.as = 'audio';
        } else if (url.includes('.webm') || url.includes('.mp4')) {
          link.as = 'video';
        } else if (url.includes('.webp') || url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg')) {
          link.as = 'image';
        }
        
        link.href = url;
        link.onload = () => {
          preloadedAssets.current.add(url);
          console.log(`✅ Asset pré-carregado: ${url}`);
          resolve();
        };
        link.onerror = () => {
          console.warn(`⚠️ Falha ao pré-carregar: ${url}`);
          reject();
        };
        
        document.head.appendChild(link);
      });
    };

    // Pré-carregar todos os assets
    const preloadAllAssets = async () => {
      console.log('🚀 Iniciando pré-carregamento de assets para Kiosker.IO...');
      
      try {
        await Promise.allSettled(assets.map(preloadAsset));
        console.log('✅ Todos os assets foram pré-carregados com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao pré-carregar assets:', error);
      }
    };

    // Executar pré-carregamento
    preloadAllAssets();

    // Cleanup
    return () => {
      // Remover links de preload se necessário
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach(link => {
        if (assets.includes(link.href)) {
          link.remove();
        }
      });
    };
  }, []);

  // Este componente não renderiza nada visualmente
  return null;
};

export default AssetCache;
