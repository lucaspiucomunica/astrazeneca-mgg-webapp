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

### 2. Criar Trigger

1. Vá para **Triggers** > **New**
2. Configure:
   - **Trigger Type**: Custom Event
   - **Event Name**: `immersion_rating`

### 3. Criar Variáveis do DataLayer

Para cada parâmetro, crie uma variável:

1. **Variable Type**: Data Layer Variable
2. **Data Layer Variable Name**: `rating`
3. **Data Layer Version**: Version 2

Repita para: `rating_category`, `page`, `user_interaction`, etc.

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
