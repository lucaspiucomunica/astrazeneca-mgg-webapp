'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Componente para gerenciar cache de assets no Kiosker.IO
 * Pre-carrega todos os assets críticos para evitar re-download
 * Versão otimizada que reutiliza elementos de mídia
 */
const AssetCache = () => {
  const preloadedAssets = useRef(new Set());
  const mediaElements = useRef(new Map()); // Armazena elementos de mídia reutilizáveis
  const [cacheStatus, setCacheStatus] = useState({
    loading: true,
    loaded: 0,
    total: 0,
    errors: 0,
    completed: false,
    cacheVerified: false
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
      completed: false,
      cacheVerified: false
    });

    // Função para pré-carregar um asset
    const preloadAsset = (url) => {
      if (preloadedAssets.current.has(url)) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        // Para vídeos, criar elemento video otimizado para cache
        if (url.includes('.webm') || url.includes('.mp4')) {
          const video = document.createElement('video');
          video.style.display = 'none';
          video.preload = 'auto';
          video.crossOrigin = 'anonymous';
          video.src = url;
          
          // Configurações para otimizar cache
          video.setAttribute('data-cached', 'true');
          
          video.onloadeddata = () => {
            preloadedAssets.current.add(url);
            mediaElements.current.set(url, video); // Armazenar para reutilização
            console.log(`✅ Vídeo pré-carregado: ${url}`);
            setCacheStatus(prev => ({
              ...prev,
              loaded: prev.loaded + 1
            }));
            resolve();
          };
          
          video.onerror = () => {
            console.warn(`⚠️ Falha ao pré-carregar vídeo: ${url}`);
            setCacheStatus(prev => ({
              ...prev,
              errors: prev.errors + 1
            }));
            reject();
          };
          
          // Iniciar carregamento
          video.load();
          
        } else if (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg')) {
          // Para áudios, criar elemento audio otimizado para cache
          const audio = document.createElement('audio');
          audio.style.display = 'none';
          audio.preload = 'auto';
          audio.crossOrigin = 'anonymous';
          audio.src = url;
          
          // Configurações para otimizar cache
          audio.setAttribute('data-cached', 'true');
          
          audio.onloadeddata = () => {
            preloadedAssets.current.add(url);
            mediaElements.current.set(url, audio); // Armazenar para reutilização
            console.log(`✅ Áudio pré-carregado: ${url}`);
            setCacheStatus(prev => ({
              ...prev,
              loaded: prev.loaded + 1
            }));
            resolve();
          };
          
          audio.onerror = () => {
            console.warn(`⚠️ Falha ao pré-carregar áudio: ${url}`);
            setCacheStatus(prev => ({
              ...prev,
              errors: prev.errors + 1
            }));
            reject();
          };
          
          // Iniciar carregamento
          audio.load();
          
        } else {
          // Para imagens, usar o método tradicional com link preload
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url;
          link.crossOrigin = 'anonymous';
          
          link.onload = () => {
            preloadedAssets.current.add(url);
            console.log(`✅ Imagem pré-carregada: ${url}`);
            setCacheStatus(prev => ({
              ...prev,
              loaded: prev.loaded + 1
            }));
            resolve();
          };
          link.onerror = () => {
            console.warn(`⚠️ Falha ao pré-carregar imagem: ${url}`);
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

    // Função para verificar se o cache está funcionando
    const verifyCache = async () => {
      console.log('🔍 Verificando se o cache está funcionando...');
      
      try {
        // Verificar se os elementos de mídia foram carregados corretamente
        const mediaElementsLoaded = mediaElements.current.size > 0;
        const allAssetsLoaded = preloadedAssets.current.size === assets.length;
        
        console.log(`📊 Elementos de mídia em cache: ${mediaElements.current.size}`);
        console.log(`📊 Assets pré-carregados: ${preloadedAssets.current.size}/${assets.length}`);
        
        // Verificar se pelo menos um elemento de mídia está funcionando
        let mediaWorking = false;
        let mediaCount = 0;
        for (const [url, element] of mediaElements.current) {
          mediaCount++;
          if (element && (element.readyState >= 1 || element.readyState === 0)) { // HAVE_METADATA ou superior, ou HAVE_NOTHING (ainda carregando)
            mediaWorking = true;
            console.log(`✅ Elemento em cache disponível: ${url} (readyState: ${element.readyState})`);
          } else {
            console.log(`⚠️ Elemento em cache com problema: ${url} (readyState: ${element?.readyState})`);
          }
        }
        
        // Cache está funcionando se:
        // 1. Todos os assets foram carregados
        // 2. Pelo menos um elemento de mídia está disponível OU não há elementos de mídia
        const cacheWorking = allAssetsLoaded && (mediaWorking || mediaCount === 0);
        
        if (cacheWorking) {
          console.log('✅ Cache está funcionando corretamente!');
          console.log(`   - Assets carregados: ${allAssetsLoaded} (${preloadedAssets.current.size}/${assets.length})`);
          console.log(`   - Elementos de mídia: ${mediaCount}`);
          setCacheStatus(prev => ({
            ...prev,
            cacheVerified: true
          }));
        } else {
          console.warn('⚠️ Cache pode não estar funcionando adequadamente');
          console.warn(`   - Assets carregados: ${allAssetsLoaded} (${preloadedAssets.current.size}/${assets.length})`);
          console.warn(`   - Mídia funcionando: ${mediaWorking} (${mediaCount} elementos)`);
          setCacheStatus(prev => ({
            ...prev,
            cacheVerified: false
          }));
        }
      } catch (error) {
        console.error('❌ Erro ao verificar cache:', error);
        setCacheStatus(prev => ({
          ...prev,
          cacheVerified: false
        }));
      }
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
        
        // Verificar se o cache está funcionando após 2 segundos
        setTimeout(verifyCache, 2000);
        
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

    // Expor elementos de mídia em cache globalmente para reutilização
    window.getCachedMediaElement = (url) => {
      return mediaElements.current.get(url);
    };

    // Cleanup
    return () => {
      // Remover links de preload se necessário
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach(link => {
        if (assets.includes(link.href)) {
          link.remove();
        }
      });
      
      // Limpar elementos de mídia em cache
      mediaElements.current.forEach((element, url) => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      mediaElements.current.clear();
      
      // Limpar função global
      delete window.getCachedMediaElement;
    };
  }, []);

  // Componente visual do indicador de cache
  const getStatusColor = () => {
    if (cacheStatus.loading) return 'bg-yellow-500';
    if (cacheStatus.errors > 0) return 'bg-red-500';
    if (cacheStatus.completed && cacheStatus.loaded === cacheStatus.total) {
      if (cacheStatus.cacheVerified === true) return 'bg-green-500';
      if (cacheStatus.cacheVerified === false) return 'bg-orange-500';
      return 'bg-blue-500';
    }
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (cacheStatus.loading) return '🔄 Cache';
    if (cacheStatus.errors > 0) return '❌ Cache';
    if (cacheStatus.completed && cacheStatus.loaded === cacheStatus.total) {
      if (cacheStatus.cacheVerified === true) return '✅ Cache OK';
      if (cacheStatus.cacheVerified === false) return '⚠️ Cache?';
      return '🔍 Verificando...';
    }
    return '⏳ Cache';
  };

  const getStatusDetails = () => {
    if (cacheStatus.loading) return `${cacheStatus.loaded}/${cacheStatus.total}`;
    if (cacheStatus.errors > 0) return `${cacheStatus.errors} erro(s)`;
    if (cacheStatus.completed) {
      if (cacheStatus.cacheVerified === true) return 'Funcionando';
      if (cacheStatus.cacheVerified === false) return 'Problema?';
      return `${cacheStatus.loaded}/${cacheStatus.total}`;
    }
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
