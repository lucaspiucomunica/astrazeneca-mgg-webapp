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
};

/**
 * Função específica para eventos de avaliação
 * @param {number} rating - Avaliação (1-5)
 * @param {object} additionalData - Dados adicionais
 */
export const trackRating = (rating, additionalData = {}) => {
  const eventData = {
    rating: rating,
    rating_category: getRatingCategory(rating),
    ...additionalData
  };

  pushToDataLayer('immersion_rating', eventData);
};

/**
 * Função para obter categoria da avaliação
 * @param {number} rating - Avaliação (1-5)
 * @returns {string} Categoria da avaliação
 */
const getRatingCategory = (rating) => {
  switch (rating) {
    case 5:
      return 'excellent';
    case 4:
      return 'good';
    case 3:
      return 'neutral';
    case 2:
      return 'poor';
    case 1:
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
  // Definir todos os parâmetros possíveis com valores padrão undefined
  const eventData = {
    eventType: eventType,
    score: undefined,
    percentage: undefined,
    questionIndex: undefined,
    totalQuestions: undefined,
    currentScore: undefined,
    // Sobrescrever com os dados reais fornecidos
    ...additionalData
  };

  pushToDataLayer('quiz_interaction', eventData);
};

/**
 * Função específica para eventos de navegação
 * @param {string} page - Página acessada (testimonials, associations, etc.)
 * @param {object} additionalData - Dados adicionais específicos do evento
 */
export const trackNavigationEvent = (page, additionalData = {}) => {
  const eventData = {
    page: page,
    eventType: 'page_view',
    ...additionalData
  };

  pushToDataLayer('page_navigation', eventData);
};

/**
 * Função para inicializar o DataLayer
 */
export const initializeDataLayer = () => {
  if (typeof window === 'undefined') return;

  // Garantir que dataLayer existe
  window.dataLayer = window.dataLayer || [];
};

/**
 * Sistema de Heartbeat para manter sessão GA4 ativa
 * Envia evento a cada 25 minutos para evitar timeout de 30min
 */
let heartbeatInterval = null;

export const startHeartbeat = () => {
  if (typeof window === 'undefined') return;
  
  // Limpar interval existente se houver
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  
  // Enviar heartbeat a cada 25 minutos (1500000ms)
  heartbeatInterval = setInterval(() => {
    pushToDataLayer('session_heartbeat', {
      timestamp: new Date().toISOString(),
      sessionDuration: Date.now() - (window.sessionStart || Date.now())
    });
  }, 25 * 60 * 1000); // 25 minutos
  
  // Registrar início da sessão
  if (!window.sessionStart) {
    window.sessionStart = Date.now();
  }
};

export const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

/**
 * Sistema de Auto-refresh por inatividade
 * Monitora interações do usuário e recarrega após período de inatividade
 */
let inactivityTimer = null;
let lastActivity = Date.now();

// Configurações (em minutos)
const INACTIVITY_TIMEOUT = 30; // 30 minutos sem interação = refresh
const HEARTBEAT_INTERVAL = 25; // 25 minutos entre heartbeats

export const startInactivityMonitor = (timeoutMinutes = INACTIVITY_TIMEOUT) => {
  if (typeof window === 'undefined') return;
  
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  const resetTimer = () => {
    lastActivity = Date.now();
    
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    inactivityTimer = setTimeout(() => {
      // Enviar evento antes de recarregar
      pushToDataLayer('auto_refresh', {
        reason: 'inactivity',
        inactiveTime: timeoutMinutes,
        sessionDuration: (Date.now() - (window.sessionStart || Date.now())) / 1000 / 60
      });
      
      // Aguardar 1 segundo para garantir envio do evento
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, timeoutMinutes * 60 * 1000);
  };
  
  // Adicionar listeners para eventos de atividade
  events.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });
  
  // Inicializar timer
  resetTimer();
};

export const stopInactivityMonitor = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
};

/**
 * Função para inicializar sistemas de kiosque
 * Combina heartbeat e monitor de inatividade
 */
export const initializeKioskMode = (inactivityMinutes = INACTIVITY_TIMEOUT) => {
  startHeartbeat();
  startInactivityMonitor(inactivityMinutes);
  
  // Enviar evento de inicialização do modo quiosque
  pushToDataLayer('kiosk_mode_initialized', {
    heartbeatInterval: HEARTBEAT_INTERVAL,
    inactivityTimeout: inactivityMinutes
  });
};
