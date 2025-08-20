# Configuração do DataLayer para Google Tag Manager

Este guia explica como configurar e usar o DataLayer para integração com Google Tag Manager (GTM).

## 🎯 O que é o DataLayer?

O DataLayer é uma camada de dados JavaScript que permite:
- Coletar dados de interações do usuário
- Enviar informações para o Google Tag Manager
- Configurar tags, triggers e variáveis no GTM
- Integrar com Google Analytics, Facebook Pixel, etc.

## 📊 Eventos Implementados

### Evento de Avaliação (`immersion_rating`)

Disparado quando um usuário avalia a experiência:

```javascript
{
  event: 'immersion_rating',
  rating: 4, // 0-4
  rating_category: 'excellent', // very_poor, poor, neutral, good, excellent
  user_agent: 'Mozilla/5.0...',
  screen_resolution: '1920x1080',
  language: 'pt-BR',
  page: 'home',
  user_interaction: 'rating_submitted',
  timestamp: '2025-01-15T10:30:00.000Z'
}
```

### Evento do Quiz (`quiz_interaction`)

Disparado durante interações com o quiz educativo:

```javascript
{
  event: 'quiz_interaction',
  eventType: 'quiz_started', // quiz_started, quiz_abandoned, quiz_completed, quiz_restarted
  user_agent: 'Mozilla/5.0...',
  screen_resolution: '1920x1080',
  language: 'pt-BR',
  data: { score: 8, questionIndex: 5 }, // Dados específicos do evento
  timestamp: '2025-01-15T10:30:00.000Z'
}
```

### Evento de Navegação (`page_navigation`)

Disparado quando usuário navega entre páginas:

```javascript
{
  event: 'page_navigation',
  page: 'depoimentos', // home, depoimentos, disease-mechanism, quiz, associacoes
  eventType: 'page_view',
  user_agent: 'Mozilla/5.0...',
  screen_resolution: '1920x1080',
  language: 'pt-BR',
  timestamp: '2025-01-15T10:30:00.000Z'
}
```

### Eventos do Quiosque (`kiosk_event`, `kiosk_heartbeat`)

Disparados para monitoramento em modo quiosque:

```javascript
// Evento do quiosque
{
  event: 'kiosk_event',
  event_type: 'kiosk_initialized', // kiosk_initialized, kiosk_interaction, kiosk_idle, kiosk_reset
  kiosk_uptime: 150000, // Tempo em ms desde inicialização
  memory_usage: 45, // Uso de memória em MB
  timestamp: '2025-01-15T10:30:00.000Z'
}

// Heartbeat
{
  event: 'kiosk_heartbeat',
  heartbeat_type: 'session_keep_alive',
  uptime: 150000,
  timestamp: '2025-01-15T10:30:00.000Z'
}
```



## 🛠️ Configuração no Google Tag Manager

### 1. Criar Tag para Eventos de Avaliação

1. No GTM, vá para **Tags** > **New**
2. Configure:
   - **Tag Type**: Google Analytics: GA4 Event
   - **Event Name**: `immersion_rating`
   - **Parameters**:
     - `rating` → `{{DLV - rating}}`
     - `rating_category` → `{{DLV - rating_category}}`
     - `page` → `{{DLV - page}}`
     - `user_interaction` → `{{DLV - user_interaction}}`

### 2. Criar Triggers

#### Trigger para Avaliações
1. Vá para **Triggers** > **New**
2. Configure:
   - **Trigger Type**: Custom Event
   - **Event Name**: `immersion_rating`

#### Trigger para Quiz
1. Vá para **Triggers** > **New**
2. Configure:
   - **Trigger Type**: Custom Event
   - **Event Name**: `quiz_interaction`

#### Trigger para Navegação
1. Vá para **Triggers** > **New**
2. Configure:
   - **Trigger Type**: Custom Event
   - **Event Name**: `page_navigation`

#### Trigger para Quiosque
1. Vá para **Triggers** > **New**
2. Configure:
   - **Trigger Type**: Custom Event
   - **Event Name**: `kiosk_event` OU `kiosk_heartbeat`

### 3. Criar Variáveis do DataLayer

Para cada parâmetro, crie uma variável:

1. **Variable Type**: Data Layer Variable
2. **Data Layer Variable Name**: `rating`
3. **Data Layer Version**: Version 2

Repita para todas as variáveis dos eventos:

**Avaliações**: `rating_category`, `page`, `user_interaction`
**Quiz**: `eventType`, `data` (objeto com score, questionIndex, etc.)
**Navegação**: `page`, `eventType`
**Quiosque**: `event_type`, `kiosk_uptime`, `memory_usage`, `heartbeat_type`

## 🧪 Como Testar

### Verificando no GTM Preview

1. No GTM, clique em **Preview**
2. Acesse sua aplicação
3. Faça uma avaliação
4. Verifique se o evento aparece no preview

### Verificando no Console do Navegador

1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Digite `window.dataLayer` para ver os eventos
4. Faça uma avaliação e verifique se o evento `immersion_rating` aparece

## 📋 Estrutura dos Dados

### Categorias de Avaliação

| Rating | Category | Descrição |
|--------|----------|-----------|
| 0 | very_poor | Muito Ruim |
| 1 | poor | Ruim |
| 2 | neutral | Neutro |
| 3 | good | Bom |
| 4 | excellent | Excelente |

### Parâmetros Disponíveis

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `rating` | number | Valor da avaliação (0-4) |
| `rating_category` | string | Categoria da avaliação |
| `user_agent` | string | User agent do navegador |
| `screen_resolution` | string | Resolução da tela |
| `language` | string | Idioma do navegador |
| `page` | string | Página atual |
| `user_interaction` | string | Tipo de interação |
| `timestamp` | string | Timestamp ISO |

## 🔧 Funções Disponíveis

### `trackRating(rating, additionalData)`

Dispara evento de avaliação:

```javascript
import { trackRating } from '../lib/datalayer';

trackRating(4, {
  page: 'home',
  user_interaction: 'rating_submitted'
});
```

### `trackQuizEvent(eventType, additionalData)`

Dispara evento do quiz:

```javascript
import { trackQuizEvent } from '../lib/datalayer';

trackQuizEvent('quiz_completed', {
  score: 8,
  totalQuestions: 10
});
```

### `trackNavigationEvent(page, additionalData)`

Dispara evento de navegação:

```javascript
import { trackNavigationEvent } from '../lib/datalayer';

trackNavigationEvent('depoimentos', {
  source: 'main_menu'
});
```

### `trackKioskEvent(eventType, additionalData)`

Dispara evento do quiosque:

```javascript
import { trackKioskEvent } from '../lib/datalayer';

trackKioskEvent('kiosk_idle', {
  idle_duration: 10
});
```

### `initializeDataLayer(config)`

Inicializa o DataLayer com configurações para quiosque:

```javascript
import { initializeDataLayer } from '../lib/datalayer';

initializeDataLayer({
  enableHeartbeat: true,
  heartbeatInterval: 25, // minutos
  enableIdleDetection: true,
  idleTimeout: 10, // minutos
  googleAnalyticsId: 'G-XXXXXXXXXX'
});
```

### `pushToDataLayer(eventName, eventData)`

Dispara evento customizado:

```javascript
import { pushToDataLayer } from '../lib/datalayer';

pushToDataLayer('custom_event', {
  custom_parameter: 'value'
});
```

### `isDataLayerAvailable()`

Verifica se o DataLayer está disponível:

```javascript
import { isDataLayerAvailable } from '../lib/datalayer';

if (isDataLayerAvailable()) {
  console.log('DataLayer está funcionando!');
}
```

## 🚨 Solução de Problemas

### Eventos não aparecem no GTM

**Sintoma**: Eventos não chegam ao GTM Preview

**Soluções**:
1. Verifique se o GTM está instalado corretamente
2. Confirme se o container ID está correto
3. Verifique se as tags e triggers estão configurados
4. Teste com o modo Preview do GTM

### Eventos duplicados

**Sintoma**: Mesmo evento disparado múltiplas vezes

**Soluções**:
1. Verifique se não há múltiplas instâncias do componente
2. Confirme se o useEffect não está sendo chamado múltiplas vezes

## 📈 Próximos Passos

1. **Configurar GTM**: Siga o guia acima para configurar tags e triggers
2. **Testar Integração**: Use o console do navegador para verificar eventos
3. **Configurar GA4**: Crie eventos personalizados no Google Analytics
4. **Monitorar**: Acompanhe os dados no GA4 e GTM

## 🔗 Links Úteis

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [Data Layer Guide](https://developers.google.com/tag-manager/devguide)
- [GA4 Events](https://developers.google.com/analytics/devguides/collection/ga4/events)

---

**Nota**: O DataLayer é inicializado automaticamente quando o componente `MiasteniaGravisApp` é montado.
