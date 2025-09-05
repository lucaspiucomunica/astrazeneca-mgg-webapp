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
- **Banco de Dados:** MongoDB Atlas com configurações otimizadas
- **UI/UX:** Swiper.js para navegação por gestos
- **Gráficos:** Recharts para dashboard administrativo
- **Analytics:** Google Tag Manager (GTM-MP68RWNM)
- **Ícones:** Lucide React (40+ ícones)
- **Deploy:** Vercel (recomendado)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun
- MongoDB Atlas (variável MONGODB_URI obrigatória)

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

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local e adicione sua MONGODB_URI
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador

## 🔧 Comandos Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento (porta 3000)
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # Executar ESLint
npm run test:mongodb  # Testar conexão MongoDB Atlas
```

### Scripts Utilitários
```bash
node scripts/test-mongodb.js  # Script standalone para MongoDB
```

## 📊 Funcionalidades

### Para Usuários
- **Experiência Imersiva:** Simula os sintomas da Miastenia Gravis com vídeo hero
- **Depoimentos:** Histórias reais de pacientes em áudio e vídeo com Swiper
- **Quiz Educativo:** Teste interativo com tracking de progresso
- **Associações:** Informações detalhadas sobre AMMI, ABRAMI, AFAG e Casa Hunter
- **Avaliação:** Sistema de feedback com escala de 1-5 estrelas

### Para Administradores
- **Painel de Estatísticas:** Acesse `/admin` para ver dados completos com Recharts
- **Dashboard Unificado:** Avaliações, quiz e navegação em gráficos interativos
- **APIs RESTful:** Endpoints com stats dedicadas para cada tipo de dados
- **Analytics:** GTM com modo quiosque e heartbeat system
- **Monitoramento:** Auto-refresh por inatividade (30min) e fallback localStorage

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
    └── test-mongodb.js     # Teste standalone MongoDB
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

## 📱 Estrutura de Navegação

### Páginas Principais
- `/` - Aplicação principal (SPA com roteamento interno)
- `/admin` - Dashboard administrativo com estatísticas unificadas

### Seções Internas (SPA)
- `home` - Experiência imersiva principal
- `testimonials` - Depoimentos de pacientes
- `quiz` - Quiz educativo interativo
- `associations` - Informações sobre associações
- `rating` - Sistema de avaliação

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Deploy automático a cada push

### Outros Provedores

A aplicação pode ser deployada em qualquer provedor que suporte Next.js.

## 🔒 Segurança e Configuração

### Variáveis de Ambiente
```env
MONGODB_URI=mongodb+srv://...
```

### Segurança
- Validação de dados nas APIs com NextResponse
- Conexão otimizada com MongoDB Atlas (pool, timeouts, retry)
- Fallback para localStorage em caso de falha de conexão
- HTTPS enforced em produção

## 📈 Monitoramento e Analytics

- **Dashboard:** Estatísticas em tempo real com Recharts
- **GTM Integration:** Tracking avançado com eventos customizados
- **Modo Quiosque:** Heartbeat a cada 25min, auto-refresh após 30min inatividade
- **Tracking de Eventos:** Navegação, quiz, avaliações e sessões
- **Fallback System:** LocalStorage quando APIs falham
- **Performance:** Otimizações para sessões longas
- **Logs:** Console logging para debugging

---

**Desenvolvido com ❤️ para conscientização sobre Miastenia Gravis**