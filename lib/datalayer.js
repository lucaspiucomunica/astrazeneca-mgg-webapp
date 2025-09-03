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
