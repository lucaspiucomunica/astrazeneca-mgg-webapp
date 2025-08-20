# Miastenia Gravis App

Aplicação web interativa para conscientização sobre Miastenia Gravis, desenvolvida com Next.js.

## 🎯 Sobre o Projeto

Esta aplicação oferece uma experiência imersiva para educar sobre a Miastenia Gravis, incluindo:
- Experiência interativa simulando os sintomas da doença
- Depoimentos em áudio e vídeo de pacientes
- Quiz educativo sobre a condição
- Informações sobre associações de apoio
- Sistema de avaliação da experiência

## 🚀 Tecnologias Utilizadas

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
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
- **Painel de Estatísticas:** Acesse `/admin` para ver dados das avaliações
- **APIs:** Endpoints para gerenciar dados
- **Monitoramento:** Acompanhe o engajamento dos usuários

## 🔧 Estrutura do Projeto

```
miastenia-gravis-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── ratings/       # Endpoints para avaliações
│   ├── admin/             # Painel administrativo
│   └── page.js            # Página principal
├── components/            # Componentes React
│   ├── MiasteniaGravisApp.js
│   └── RatingStats.js
├── public/                # Arquivos estáticos
│   ├── audio/             # Depoimentos em áudio
│   ├── video/             # Vídeos
│   └── images/            # Imagens
└── scripts/               # Scripts utilitários
    └── test-mongodb.js
```

## 🌐 APIs Disponíveis

- `GET /api/ratings` - Listar todas as avaliações
- `POST /api/ratings` - Salvar nova avaliação
- `GET /api/ratings/stats` - Estatísticas das avaliações

## 📱 Páginas

- `/` - Página principal com experiência imersiva
- `/admin` - Painel de administração com estatísticas

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Deploy automático a cada push

### Outros Provedores

A aplicação pode ser deployada em qualquer provedor que suporte Next.js.

## 🔒 Segurança

- Validação de dados nas APIs
- Fallback para localStorage em caso de falha de conexão

## 📈 Monitoramento

- Estatísticas em tempo real no painel administrativo
- Logs de erro no console
- Métricas de engajamento dos usuários

---

**Desenvolvido com ❤️ para conscientização sobre Miastenia Gravis**