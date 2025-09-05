'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('✅ Service Worker registrado com sucesso!');
          console.log('📍 Escopo:', registration.scope);
          
          // Verifica o status
          if (registration.installing) {
            console.log('🔄 Service Worker está instalando...');
          } else if (registration.waiting) {
            console.log('⏳ Service Worker está aguardando...');
          } else if (registration.active) {
            console.log('🚀 Service Worker está ativo!');
          }
        })
        .catch(error => console.error('❌ Erro ao registrar Service Worker:', error));
    } else {
      console.warn('⚠️ Service Workers não são suportados neste navegador');
    }
  }, []);

  return null;
}