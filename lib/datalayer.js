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
 * Função para inicializar o DataLayer (chamada no carregamento da página)
 */
export const initializeDataLayer = () => {
  if (typeof window === 'undefined') return;

  // Garantir que dataLayer existe
  window.dataLayer = window.dataLayer || [];
};
