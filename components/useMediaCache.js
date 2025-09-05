'use client';

import { useRef, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar cache de elementos de mídia
 * Otimiza o uso de recursos reutilizando elementos de vídeo e áudio
 */
export const useMediaCache = () => {
  const mediaCache = useRef(new Map());
  const activeElements = useRef(new Set());

  /**
   * Obtém um elemento de mídia em cache ou cria um novo
   * @param {string} url - URL do arquivo de mídia
   * @param {string} type - Tipo de mídia ('video' ou 'audio')
   * @returns {HTMLVideoElement|HTMLAudioElement} Elemento de mídia
   */
  const getMediaElement = useCallback((url, type) => {
    // Verificar se já existe um elemento em cache
    if (mediaCache.current.has(url)) {
      const cachedElement = mediaCache.current.get(url);
      console.log(`♻️ Reutilizando elemento em cache: ${url}`);
      return cachedElement;
    }

    // Verificar se existe elemento global em cache (do AssetCache)
    const globalCachedElement = window.getCachedMediaElement ? window.getCachedMediaElement(url) : null;
    if (globalCachedElement) {
      console.log(`♻️ Reutilizando elemento global em cache: ${url}`);
      mediaCache.current.set(url, globalCachedElement);
      return globalCachedElement;
    }

    // Criar novo elemento
    console.log(`🆕 Criando novo elemento: ${url}`);
    const element = type === 'video' ? document.createElement('video') : document.createElement('audio');
    
    // Configurações otimizadas
    element.src = url;
    element.preload = 'auto';
    element.crossOrigin = 'anonymous';
    element.setAttribute('data-cached', 'true');
    
    // Armazenar no cache local
    mediaCache.current.set(url, element);
    activeElements.current.add(element);
    
    return element;
  }, []);

  /**
   * Remove um elemento de mídia do cache
   * @param {string} url - URL do arquivo de mídia
   */
  const removeFromCache = useCallback((url) => {
    if (mediaCache.current.has(url)) {
      const element = mediaCache.current.get(url);
      activeElements.current.delete(element);
      mediaCache.current.delete(url);
      console.log(`🗑️ Removido do cache: ${url}`);
    }
  }, []);

  /**
   * Limpa todo o cache de mídia
   */
  const clearCache = useCallback(() => {
    mediaCache.current.forEach((element, url) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    mediaCache.current.clear();
    activeElements.current.clear();
    console.log('🧹 Cache de mídia limpo');
  }, []);

  /**
   * Pausa todos os elementos de mídia ativos
   */
  const pauseAllMedia = useCallback(() => {
    activeElements.current.forEach(element => {
      if (element && !element.paused) {
        element.pause();
      }
    });
  }, []);

  /**
   * Obtém estatísticas do cache
   * @returns {Object} Estatísticas do cache
   */
  const getCacheStats = useCallback(() => {
    return {
      cachedElements: mediaCache.current.size,
      activeElements: activeElements.current.size,
      urls: Array.from(mediaCache.current.keys())
    };
  }, []);

  return {
    getMediaElement,
    removeFromCache,
    clearCache,
    pauseAllMedia,
    getCacheStats
  };
};
