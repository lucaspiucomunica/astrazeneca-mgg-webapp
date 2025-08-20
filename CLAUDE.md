# CLAUDE.md

Este arquivo fornece orientações para o Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Comandos de Desenvolvimento

- **Servidor de desenvolvimento**: `npm run dev` - Inicia o servidor Next.js em http://localhost:3000
- **Build**: `npm run build` - Cria build de produção
- **Iniciar produção**: `npm run start` - Executa servidor de produção
- **Linting**: `npm run lint` - Executa ESLint com configuração Next.js
- **Teste MongoDB**: `npm run test:mongodb` - Testa conexão MongoDB usando scripts/test-mongodb.js

## Arquitetura do Projeto

Esta é uma aplicação Next.js 15 usando arquitetura App Router para uma campanha de conscientização sobre Miastenia Gravis. A aplicação oferece uma experiência imersiva para educar usuários sobre a condição.

### Arquitetura Principal

- **Framework**: Next.js 15 com React 19
- **Estilização**: Tailwind CSS 4
- **Banco de dados**: MongoDB Atlas com pool de conexões
- **Analytics**: Integração Google Tag Manager via DataLayer
- **Ícones**: Lucide React

### Estrutura de Diretórios

```
app/
├── api/
│   ├── quiz-events/      # APIs do sistema de quiz (GET/POST)
│   │   └── stats/        # Endpoint de estatísticas do quiz
│   ├── ratings/          # APIs do sistema de avaliação (GET/POST)
│   │   └── stats/        # Endpoint de estatísticas de avaliação
│   └── test-mongodb/     # Endpoint de teste da conexão MongoDB
├── admin/                # Dashboard administrativo para ver estatísticas
└── layout.js, page.js    # Layout raiz e página inicial

components/
├── MiasteniaGravisApp.js # Componente interativo principal
├── QuizStats.js         # Componente de exibição de estatísticas do quiz
└── RatingStats.js        # Componente de exibição de estatísticas de avaliação

lib/
├── mongodb.js           # Conexão MongoDB com tratamento dev/prod
└── datalayer.js         # Integração GTM DataLayer

config/
└── mongodb-config.example.js  # Template de configuração MongoDB

scripts/
└── test-mongodb.js      # Script de teste da conexão MongoDB

public/
├── audio/               # Depoimentos de pacientes (MP3)
├── video/               # Vídeos promocionais (MP4)
└── images/              # Assets estáticos e logos de associações
```

### Componentes Principais

**MiasteniaGravisApp.js** - Componente interativo principal contendo:
- Navegação multipágina (home, depoimentos, quiz, associações, avaliação)
- Controles de player de áudio/vídeo
- Sistema de quiz educativo
- Coleta de avaliações com tracking GTM
- Diretório de associações com informações de contato

**Sistema de Avaliação**:
- Coleta feedback do usuário (escala 1-5)
- Armazena no MongoDB via `/api/ratings`
- Rastreia eventos via DataLayer para GTM
- Estatísticas admin disponíveis em `/admin`

**Sistema de Quiz Educativo**:
- Rastreia eventos do quiz (início, abandono, conclusão, reinício)
- Armazena eventos no MongoDB via `/api/quiz-events`
- Coleta dados de pontuação e abandono por pergunta
- Estatísticas detalhadas disponíveis no dashboard admin

**Integração DataLayer**:
- Rastreia eventos `immersion_rating`
- Inclui rating, categoria, user agent, resolução de tela
- Ver DATALAYER_SETUP.md para configuração GTM

### Schema do Banco de Dados

Coleção MongoDB: `ratings`
```javascript
{
  rating: number,        // Escala 1-5
  timestamp: string,     // Timestamp ISO
  createdAt: Date       // Timestamp MongoDB
}
```

Coleção MongoDB: `quiz_events`
```javascript
{
  eventType: string,     // 'quiz_started', 'quiz_abandoned', 'quiz_completed', 'quiz_restarted'
  timestamp: string,     // Timestamp ISO
  data: object,          // Dados específicos do evento (score, questionIndex, etc.)
  createdAt: Date       // Timestamp MongoDB
}
```

### Configuração de Ambiente

Variáveis de ambiente obrigatórias:
- `MONGODB_URI` - String de conexão MongoDB Atlas
- Copie `config/mongodb-config.example.js` para `.env.local` para configuração

### Endpoints da API

**Sistema de Avaliações:**
- `GET /api/ratings` - Busca todas as avaliações com metadados
- `POST /api/ratings` - Salva nova avaliação (campo rating obrigatório)
- `GET /api/ratings/stats` - Estatísticas e agregações das avaliações

**Sistema de Quiz:**
- `GET /api/quiz-events` - Busca todos os eventos do quiz
- `POST /api/quiz-events` - Salva novo evento do quiz (eventType obrigatório)
- `GET /api/quiz-events/stats` - Estatísticas detalhadas do quiz (taxas, pontuações, abandono)

**Utilitários:**
- `GET /api/test-mongodb` - Teste de conexão MongoDB

### Notas de Desenvolvimento

- Usa JSConfig com alias de caminho `@/*` para imports
- ESLint configurado com core web vitals do Next.js
- Conexão MongoDB usa cache global em desenvolvimento
- DataLayer inicializa automaticamente na montagem do componente
- Interface em português brasileiro (pt-BR)

### Assets de Mídia

- Depoimentos de pacientes em `public/audio/`
- Vídeos educativos em `public/video/`
- QR codes e thumbnails em `public/images/`
- Logos de associações parceiras em `public/images/` (AMMI, ABRAMI, AFAG, Casa Hunter)

### Testes

Conexão MongoDB pode ser testada com:
```bash
npm run test:mongodb
```

Este projeto foca na acessibilidade e educação do usuário sobre Miastenia Gravis através de experiências interativas, depoimentos, quiz educativo e recursos de apoio abrangentes. O dashboard administrativo fornece insights detalhados sobre o engajamento dos usuários tanto no sistema de avaliações quanto no quiz educativo.

- Nunca use emojis no projeto em logs, outputs, etc
- Linguagem oficial: Português-BR