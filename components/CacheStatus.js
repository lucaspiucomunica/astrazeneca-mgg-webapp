'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';

const CacheStatus = () => {
  const [cacheStatus, setCacheStatus] = useState('checking');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Verificar status online/offline
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Verificar cache
    if ('caches' in window) {
      caches.open('miastenia-gravis-v1').then(cache => {
        cache.keys().then(requests => {
          setCacheStatus(requests.length > 0 ? 'cached' : 'not-cached');
        });
      });
    } else {
      setCacheStatus('not-supported');
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return null; // Não mostrar em desenvolvimento
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs">
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        
        {cacheStatus === 'cached' ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : cacheStatus === 'not-cached' ? (
          <XCircle className="w-4 h-4 text-yellow-500" />
        ) : (
          <XCircle className="w-4 h-4 text-gray-500" />
        )}
        
        <span className="text-gray-600">
          {isOnline ? 'Online' : 'Offline'} | 
          {cacheStatus === 'cached' ? 'Cache OK' : 
           cacheStatus === 'not-cached' ? 'Cache vazio' : 
           'Cache não suportado'}
        </span>
      </div>
    </div>
  );
};

export default CacheStatus;
