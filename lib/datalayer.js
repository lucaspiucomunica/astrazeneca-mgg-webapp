/**
 * Gerenciador do DataLayer para Google Tag Manager
 */

// Inicializar DataLayer se não existir
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

/**
 * Função para disparar eventos no DataLayer
 * @param {string} eventName - Nome do evento
 * @param {object} eventData - Dados do evento
 */
export const pushToDataLayer = (eventName, eventData = {}) => {
  if (typeof window === 'undefined') {
    return;
  }

  // Garantir que dataLayer existe
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  // Criar objeto do evento
  const event = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...eventData
  };

  // Enviar para DataLayer
  window.dataLayer.push(event);

  // Log para debug
  console.log('🎯 DataLayer Event:', event);
};

/**
 * Função específica para eventos de avaliação
 * @param {number} rating - Avaliação (0-4)
 * @param {object} additionalData - Dados adicionais
 */
export const trackRating = (rating, additionalData = {}) => {
  const eventData = {
    rating: rating,
    rating_category: getRatingCategory(rating),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    screen_resolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : null,
    language: typeof navigator !== 'undefined' ? navigator.language : null,
    ...additionalData
  };

  pushToDataLayer('immersion_rating', eventData);
};

/**
 * Função para obter categoria da avaliação
 * @param {number} rating - Avaliação (0-4)
 * @returns {string} Categoria da avaliação
 */
const getRatingCategory = (rating) => {
  switch (rating) {
    case 4:
      return 'excellent';
    case 3:
      return 'good';
    case 2:
      return 'neutral';
    case 1:
      return 'poor';
    case 0:
      return 'very_poor';
    default:
      return 'unknown';
  }
};

/**
 * Função para verificar se o DataLayer está disponível
 * @returns {boolean} True se disponível
 */
export const isDataLayerAvailable = () => {
  return typeof window !== 'undefined' && window.dataLayer;
};

/**
 * Função específica para eventos do quiz
 * @param {string} eventType - Tipo do evento (quiz_started, quiz_abandoned, quiz_completed, quiz_restarted)
 * @param {object} additionalData - Dados adicionais específicos do evento
 */
export const trackQuizEvent = (eventType, additionalData = {}) => {
  const eventData = {
    eventType: eventType,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    screen_resolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : null,
    language: typeof navigator !== 'undefined' ? navigator.language : null,
    ...additionalData
  };

  pushToDataLayer('quiz_interaction', eventData);
};

/**
 * Função para configurar Google Analytics com otimizações para modo quiosque
 * @param {string} measurementId - ID de medição do GA (ex: 'GA_MEASUREMENT_ID')
 */
export const configureGoogleAnalytics = (measurementId) => {
  if (typeof window === 'undefined' || !measurementId) return;

  // Configurações otimizadas para modo quiosque
  if (window.gtag) {
    window.gtag('config', measurementId, {
      session_timeout: 7200, // 2 horas em segundos
      send_page_view: true,
      allow_google_signals: false, // Desabilitar para performance
      allow_ad_personalization_signals: false, // Não necessário para quiosque
    });
  }
};

/**
 * Função para enviar heartbeat e manter sessão ativa
 */
export const sendHeartbeat = () => {
  pushToDataLayer('kiosk_heartbeat', {
    heartbeat_type: 'session_keep_alive',
    timestamp: new Date().toISOString(),
    uptime: Date.now() - (window.kioskStartTime || Date.now())
  });
};

/**
 * Função para inicializar sistema de heartbeat
 * @param {number} intervalMinutes - Intervalo em minutos (padrão: 25 minutos)
 */
export const initializeHeartbeat = (intervalMinutes = 25) => {
  if (typeof window === 'undefined') return;

  // Marcar tempo de início do quiosque
  window.kioskStartTime = window.kioskStartTime || Date.now();

  // Configurar heartbeat
  if (window.kioskHeartbeatInterval) {
    clearInterval(window.kioskHeartbeatInterval);
  }

  window.kioskHeartbeatInterval = setInterval(() => {
    sendHeartbeat();
  }, intervalMinutes * 60 * 1000);

  // Enviar heartbeat inicial
  sendHeartbeat();
};

/**
 * Função para rastrear eventos específicos do quiosque
 * @param {string} eventType - Tipo do evento (kiosk_interaction, kiosk_idle, kiosk_reset)
 * @param {object} additionalData - Dados adicionais
 */
export const trackKioskEvent = (eventType, additionalData = {}) => {
  const eventData = {
    event_type: eventType,
    kiosk_uptime: Date.now() - (window.kioskStartTime || Date.now()),
    memory_usage: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : null,
    timestamp: new Date().toISOString(),
    ...additionalData
  };

  pushToDataLayer('kiosk_event', eventData);
};

/**
 * Função para detectar inatividade e resetar se necessário
 * @param {number} timeoutMinutes - Timeout em minutos (padrão: 10 minutos)
 * @param {function} resetCallback - Função para executar no reset
 */
export const initializeIdleDetection = (timeoutMinutes = 10, resetCallback = null) => {
  if (typeof window === 'undefined') return;

  let idleTimer;
  const idleTimeout = timeoutMinutes * 60 * 1000;

  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      trackKioskEvent('kiosk_idle', { idle_duration: timeoutMinutes });
      if (resetCallback) {
        resetCallback();
      }
    }, idleTimeout);
  };

  // Eventos para detectar atividade
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.addEventListener(event, resetIdleTimer, true);
  });

  // Inicializar timer
  resetIdleTimer();
};

/**
 * Função para inicializar o DataLayer com configurações para quiosque
 * @param {object} config - Configurações do quiosque
 */
export const initializeDataLayer = (config = {}) => {
  if (typeof window === 'undefined') return;

  // Garantir que dataLayer existe
  window.dataLayer = window.dataLayer || [];

  // Configurações padrão para quiosque
  const defaultConfig = {
    enableHeartbeat: true,
    heartbeatInterval: 25, // minutos
    enableIdleDetection: true,
    idleTimeout: 10, // minutos
    googleAnalyticsId: null,
    ...config
  };

  // Configurar Google Analytics se ID fornecido
  if (defaultConfig.googleAnalyticsId) {
    configureGoogleAnalytics(defaultConfig.googleAnalyticsId);
  }

  // Inicializar heartbeat se habilitado
  if (defaultConfig.enableHeartbeat) {
    initializeHeartbeat(defaultConfig.heartbeatInterval);
  }

  // Inicializar detecção de inatividade se habilitado
  if (defaultConfig.enableIdleDetection && defaultConfig.resetCallback) {
    initializeIdleDetection(defaultConfig.idleTimeout, defaultConfig.resetCallback);
  }

  // Rastrear inicialização do quiosque
  trackKioskEvent('kiosk_initialized', {
    config: defaultConfig
  });
};
