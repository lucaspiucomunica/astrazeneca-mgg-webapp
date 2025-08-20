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
├── api/ratings/           # APIs do sistema de avaliação (GET/POST)
│   └── stats/            # Endpoint de estatísticas de avaliação
├── admin/                # Dashboard administrativo para ver estatísticas
└── layout.js, page.js    # Layout raiz e página inicial

components/
├── MiasteniaGravisApp.js # Componente interativo principal
└── RatingStats.js        # Componente de exibição de estatísticas

lib/
├── mongodb.js           # Conexão MongoDB com tratamento dev/prod
└── datalayer.js         # Integração GTM DataLayer

config/
└── mongodb-config.example.js  # Template de configuração MongoDB

public/
├── audio/               # Depoimentos de pacientes (MP3)
├── video/               # Vídeos promocionais (MP4)
└── images/              # Assets estáticos
```

### Componentes Principais

**MiasteniaGravisApp.js** - Componente interativo principal contendo:
- Navegação multipágina (home, depoimentos, quiz, associações, avaliação)
- Controles de player de áudio/vídeo
- Sistema de quiz educativo
- Coleta de avaliações com tracking GTM
- Diretório de associações com informações de contato

**Sistema de Avaliação**:
- Coleta feedback do usuário (escala 0-4)
- Armazena no MongoDB via `/api/ratings`
- Rastreia eventos via DataLayer para GTM
- Estatísticas admin disponíveis em `/admin`

**Integração DataLayer**:
- Rastreia eventos `immersion_rating`
- Inclui rating, categoria, user agent, resolução de tela
- Ver DATALAYER_SETUP.md para configuração GTM

### Schema do Banco de Dados

Coleção MongoDB: `ratings`
```javascript
{
  rating: number,        // Escala 0-4
  timestamp: string,     // Timestamp ISO
  createdAt: Date       // Timestamp MongoDB
}
```

### Configuração de Ambiente

Variáveis de ambiente obrigatórias:
- `MONGODB_URI` - String de conexão MongoDB Atlas
- Copie `config/mongodb-config.example.js` para `.env.local` para configuração

### Endpoints da API

- `GET /api/ratings` - Busca todas as avaliações com metadados
- `POST /api/ratings` - Salva nova avaliação (campo rating obrigatório)
- `GET /api/ratings/stats` - Estatísticas e agregações das avaliações
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

### Testes

Conexão MongoDB pode ser testada com:
```bash
npm run test:mongodb
```

Este projeto foca na acessibilidade e educação do usuário sobre Miastenia Gravis através de experiências interativas, depoimentos e recursos de apoio abrangentes.

- Nunca use emojis no projeto em logs, outputs, etc
- Linguagem oficial: Português-BR