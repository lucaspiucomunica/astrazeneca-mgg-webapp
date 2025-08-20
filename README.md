# Miastenia Gravis App

Aplicação web interativa para conscientização sobre Miastenia Gravis, desenvolvida com Next.js.

## 🎯 Sobre o Projeto

Esta aplicação oferece uma experiência imersiva para educar sobre a Miastenia Gravis, incluindo:
- Experiência interativa simulando os sintomas da doença
- Depoimentos em áudio e vídeo de pacientes
- Quiz educativo sobre a condição com sistema de tracking
- Informações sobre associações de apoio (AMMI, ABRAMI, AFAG, Casa Hunter)
- Sistema de avaliação da experiência
- Rastreamento de navegação e analytics integrado

## 🚀 Tecnologias Utilizadas

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Banco de Dados:** MongoDB Atlas
- **Analytics:** Google Tag Manager integration
- **Ícones:** Lucide React
- **Deploy:** Vercel (recomendado)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd miastenia-gravis-app
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador

## 📊 Funcionalidades

### Para Usuários
- **Experiência Imersiva:** Simula os sintomas da Miastenia Gravis
- **Depoimentos:** Histórias reais de pacientes em áudio e vídeo
- **Quiz Educativo:** Teste seus conhecimentos sobre a doença
- **Associações:** Informações sobre grupos de apoio
- **Avaliação:** Sistema de feedback sobre a experiência

### Para Administradores
- **Painel de Estatísticas:** Acesse `/admin` para ver dados completos
- **Dashboard Unificado:** Avaliações, quiz e navegação em uma interface
- **APIs:** Endpoints para gerenciar todos os tipos de dados
- **Analytics:** Google Tag Manager integration para tracking avançado
- **Monitoramento:** Acompanhe o engajamento dos usuários em tempo real

## 🔧 Estrutura do Projeto

```
miastenia-gravis-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── navigation-events/ # Tracking de navegação
│   │   ├── quiz-events/   # Tracking do quiz
│   │   ├── ratings/       # Sistema de avaliações
│   │   └── test-mongodb/  # Teste de conexão BD
│   ├── admin/             # Painel administrativo
│   └── page.js            # Página principal
├── components/            # Componentes React
│   ├── MiasteniaGravisApp.js  # App principal
│   ├── NavigationStats.js     # Stats de navegação
│   ├── QuizStats.js          # Stats do quiz
│   └── RatingStats.js        # Stats das avaliações
├── lib/                   # Bibliotecas
│   ├── mongodb.js         # Conexão MongoDB
│   └── datalayer.js       # Integração GTM
├── public/                # Arquivos estáticos
│   ├── audio/             # Depoimentos em áudio
│   ├── video/             # Vídeos
│   └── images/            # Imagens e logos WebP
└── scripts/               # Scripts utilitários
    └── test-mongodb.js
```

## 🌐 APIs Disponíveis

### Sistema de Avaliações
- `GET /api/ratings` - Listar todas as avaliações
- `POST /api/ratings` - Salvar nova avaliação
- `GET /api/ratings/stats` - Estatísticas das avaliações

### Sistema do Quiz
- `GET /api/quiz-events` - Listar eventos do quiz
- `POST /api/quiz-events` - Salvar evento do quiz
- `GET /api/quiz-events/stats` - Estatísticas do quiz

### Sistema de Navegação
- `GET /api/navigation-events` - Listar eventos de navegação
- `POST /api/navigation-events` - Salvar evento de navegação
- `GET /api/navigation-events/stats` - Estatísticas de navegação

### Utilitários
- `GET /api/test-mongodb` - Testar conexão MongoDB

## 📱 Páginas

- `/` - Página principal com experiência imersiva
- `/admin` - Dashboard administrativo com estatísticas unificadas

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Deploy automático a cada push

### Outros Provedores

A aplicação pode ser deployada em qualquer provedor que suporte Next.js.

## 🔒 Segurança

- Validação de dados nas APIs
- Conexão segura com MongoDB Atlas
- Fallback para localStorage em caso de falha de conexão

## 📈 Monitoramento

- Dashboard unificado com estatísticas em tempo real
- Integração com Google Tag Manager para analytics avançado
- Tracking de navegação, quiz e avaliações
- Sistema de heartbeat para modo quiosque
- Logs de erro no console
- Métricas de engajamento dos usuários

---

**Desenvolvido com ❤️ para conscientização sobre Miastenia Gravis**