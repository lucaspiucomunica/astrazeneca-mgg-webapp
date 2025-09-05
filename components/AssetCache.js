'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Componente para gerenciar cache de assets no Kiosker.IO
 * Pre-carrega todos os assets críticos para evitar re-download
 */
const AssetCache = () => {
  const preloadedAssets = useRef(new Set());
  const [cacheStatus, setCacheStatus] = useState({
    loading: true,
    loaded: 0,
    total: 0,
    errors: 0,
    completed: false
  });

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

    // Inicializar status
    setCacheStatus({
      loading: true,
      loaded: 0,
      total: assets.length,
      errors: 0,
      completed: false
    });

    // Função para pré-carregar um asset
    const preloadAsset = (url) => {
      if (preloadedAssets.current.has(url)) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        // Para vídeos e áudios, usar fetch para forçar o download
        if (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg') || 
            url.includes('.webm') || url.includes('.mp4')) {
          
          fetch(url, { 
            method: 'HEAD', // Apenas verificar se o arquivo existe
            cache: 'force-cache' // Forçar cache
          })
          .then(() => {
            // Se o HEAD funcionou, fazer o download completo
            return fetch(url, { cache: 'force-cache' });
          })
          .then(response => {
            if (response.ok) {
              preloadedAssets.current.add(url);
              console.log(`✅ Asset pré-carregado: ${url}`);
              setCacheStatus(prev => ({
                ...prev,
                loaded: prev.loaded + 1
              }));
              resolve();
            } else {
              throw new Error(`HTTP ${response.status}`);
            }
          })
          .catch(error => {
            console.warn(`⚠️ Falha ao pré-carregar: ${url} - ${error.message}`);
            setCacheStatus(prev => ({
              ...prev,
              errors: prev.errors + 1
            }));
            reject(error);
          });
          
        } else {
          // Para imagens, usar o método tradicional com link preload
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url;
          
          link.onload = () => {
            preloadedAssets.current.add(url);
            console.log(`✅ Asset pré-carregado: ${url}`);
            setCacheStatus(prev => ({
              ...prev,
              loaded: prev.loaded + 1
            }));
            resolve();
          };
          link.onerror = () => {
            console.warn(`⚠️ Falha ao pré-carregar: ${url}`);
            setCacheStatus(prev => ({
              ...prev,
              errors: prev.errors + 1
            }));
            reject();
          };
          
          document.head.appendChild(link);
        }
      });
    };

    // Pré-carregar todos os assets
    const preloadAllAssets = async () => {
      console.log('🚀 Iniciando pré-carregamento de assets para Kiosker.IO...');
      
      try {
        await Promise.allSettled(assets.map(preloadAsset));
        console.log('✅ Todos os assets foram pré-carregados com sucesso!');
        setCacheStatus(prev => ({
          ...prev,
          loading: false,
          completed: true
        }));
      } catch (error) {
        console.error('❌ Erro ao pré-carregar assets:', error);
        setCacheStatus(prev => ({
          ...prev,
          loading: false,
          completed: true
        }));
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

  // Componente visual do indicador de cache
  const getStatusColor = () => {
    if (cacheStatus.loading) return 'bg-yellow-500';
    if (cacheStatus.errors > 0) return 'bg-red-500';
    if (cacheStatus.completed && cacheStatus.loaded === cacheStatus.total) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (cacheStatus.loading) return '🔄 Cache';
    if (cacheStatus.errors > 0) return '❌ Cache';
    if (cacheStatus.completed && cacheStatus.loaded === cacheStatus.total) return '✅ Cache';
    return '⏳ Cache';
  };

  const getStatusDetails = () => {
    if (cacheStatus.loading) return `${cacheStatus.loaded}/${cacheStatus.total}`;
    if (cacheStatus.errors > 0) return `${cacheStatus.errors} erro(s)`;
    if (cacheStatus.completed) return `${cacheStatus.loaded}/${cacheStatus.total}`;
    return '';
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`${getStatusColor()} text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all duration-300`}>
        <span>{getStatusText()}</span>
        {getStatusDetails() && (
          <span className="text-xs opacity-90">({getStatusDetails()})</span>
        )}
      </div>
    </div>
  );
};

export default AssetCache;
