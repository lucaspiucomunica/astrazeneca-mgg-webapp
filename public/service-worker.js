const CACHE_NAME = 'miastenia-v1';

// Lista todos os seus assets
const urlsToCache = [
  // Vídeos
  '/video/miastenia-gravis-hero.webm',
  '/video/miastenia-gravis.webm',
  
  // Áudios
  '/audio/guilherme.mp3',
  '/audio/kenia.mp3',
  
  // Imagens principais
  '/images/thumb-video-hero.webp',
  '/images/thumb-video.png',
  '/images/logo-abrami.webp',
  '/images/logo-afag.webp',
  '/images/logo-AMMI.webp',
  '/images/logo-casahunter.webp',
  '/images/qr-code.png'
];

// INSTALAÇÃO E CACHE INICIAL
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📂 Cache aberto:', CACHE_NAME);
        console.log('⬇️ Baixando', urlsToCache.length, 'arquivos...');
        
        // Cacheia um por um para ter feedback individual
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url)
              .then(() => console.log('✅ Cacheado:', url))
              .catch(err => console.error('❌ Falha ao cachear:', url, err));
          })
        );
      })
      .then(() => {
        console.log('🎉 Todos os assets foram cacheados com sucesso!');
        console.log('💾 Total de', urlsToCache.length, 'arquivos no cache');
        console.log('📱 App pronto para uso offline!');
      })
      .catch(err => {
        console.error('❌ Erro durante instalação:', err);
      })
  );
  
  // Força ativação imediata
  self.skipWaiting();
});

// ATIVAÇÃO
self.addEventListener('activate', (event) => {
  console.log('⚡ Service Worker: Ativado');
  
  // Limpa caches antigos se houver
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✨ Service Worker pronto e limpo!');
      // Toma controle imediato de todas as páginas
      return self.clients.claim();
    })
  );
});

// INTERCEPTA REQUISIÇÕES
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Só loga assets importantes (não CSS/JS pequenos)
          const url = event.request.url;
          if (url.includes('.webm') || 
              url.includes('.mp3') || 
              url.includes('.webp') ||
              url.includes('.png')) {
            console.log('💾 Servido do Cache:', url.split('/').pop());
          }
          return response;
        }
        
        // Não está no cache, busca da rede
        const url = event.request.url;
        if (url.includes('.webm') || 
            url.includes('.mp3') || 
            url.includes('.webp') ||
            url.includes('.png')) {
          console.log('🌐 Baixando da Internet:', url.split('/').pop());
        }
        
        return fetch(event.request)
          .then(response => {
            // Opção: cachear dinamicamente novos recursos
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Se quiser cachear novos assets automaticamente (opcional)
            const responseToCache = response.clone();
            const url = event.request.url;
            
            if (url.includes('/images/') || url.includes('/audio/') || url.includes('/video/')) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
                console.log('➕ Novo arquivo adicionado ao cache:', url.split('/').pop());
              });
            }
            
            return response;
          })
          .catch(error => {
            console.error('❌ Erro ao buscar da rede:', event.request.url);
            console.error('Detalhes:', error);
            
            // Retorna página offline se tiver
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// MENSAGENS DE DEBUG
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  // Comando para verificar status do cache
  if (event.data === 'checkCache') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(requests => {
        console.log('');
        console.log('📊 === STATUS DO CACHE ===');
        console.log('📁 Nome do Cache:', CACHE_NAME);
        console.log('📈 Total de arquivos:', requests.length);
        console.log('📋 Arquivos cacheados:');
        
        let videos = 0, audios = 0, imagens = 0;
        
        requests.forEach(request => {
          const url = request.url;
          const filename = url.split('/').pop();
          
          if (url.includes('.webm')) {
            console.log('  🎬', filename);
            videos++;
          } else if (url.includes('.mp3')) {
            console.log('  🎵', filename);
            audios++;
          } else if (url.includes('.webp') || url.includes('.png')) {
            console.log('  🖼️', filename);
            imagens++;
          } else {
            console.log('  📄', filename);
          }
        });
        
        console.log('');
        console.log('📊 Resumo:');
        console.log(`  🎬 ${videos} vídeos`);
        console.log(`  🎵 ${audios} áudios`);
        console.log(`  🖼️ ${imagens} imagens`);
        console.log('========================');
      });
    });
  }
  
  // Comando para verificar tamanho do cache
  if (event.data === 'cacheSize') {
    caches.open(CACHE_NAME).then(async cache => {
      const requests = await cache.keys();
      let totalSize = 0;
      
      console.log('');
      console.log('💾 === TAMANHO DO CACHE ===');
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
          const filename = request.url.split('/').pop();
          console.log(`  ${filename}: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
        }
      }
      
      console.log('');
      console.log(`📊 TOTAL: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log('===========================');
    });
  }
});

// Log inicial
console.log('📄 Service Worker carregado: service-worker.js');
console.log('🔧 Versão do cache:', CACHE_NAME);