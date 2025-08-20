# Miastenia Gravis App

Aplicação web interativa para conscientização sobre Miastenia Gravis, desenvolvida com Next.js e MongoDB Atlas.

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
- **Banco de Dados:** MongoDB Atlas
- **Analytics:** DataLayer para Google Tag Manager
- **Ícones:** Lucide React
- **Deploy:** Vercel (recomendado)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Conta no MongoDB Atlas (gratuita)

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

3. Configure o MongoDB Atlas:
   - Siga o guia em [MONGODB_SETUP.md](./MONGODB_SETUP.md)
   - Crie um arquivo `.env.local` com sua string de conexão

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador

## 🗄️ Configuração do MongoDB Atlas

Para configurar o banco de dados, siga o guia detalhado em [MONGODB_SETUP.md](./MONGODB_SETUP.md).

## 📊 Configuração do DataLayer

Para configurar o DataLayer e Google Tag Manager, siga o guia em [DATALAYER_SETUP.md](./DATALAYER_SETUP.md).

### Resumo rápido:

1. Crie uma conta no [MongoDB Atlas](https://cloud.mongodb.com)
2. Crie um cluster gratuito
3. Configure usuário e acesso à rede
4. Copie a string de conexão
5. Crie o arquivo `.env.local` com:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/miastenia-gravis-db?retryWrites=true&w=majority
```

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
│   │   ├── ratings/       # Endpoints para avaliações
│   │   └── test-mongodb/  # Teste de conexão
│   ├── admin/             # Painel administrativo
│   └── page.js            # Página principal
├── components/            # Componentes React
│   ├── MiasteniaGravisApp.js
│   └── RatingStats.js
├── lib/                   # Utilitários
│   └── mongodb.js         # Configuração do MongoDB
├── public/                # Arquivos estáticos
│   ├── audio/             # Depoimentos em áudio
│   ├── video/             # Vídeos
│   └── images/            # Imagens
└── config/                # Configurações
    └── mongodb-config.example.js
```

## 🌐 APIs Disponíveis

- `GET /api/test-mongodb` - Teste de conexão com MongoDB
- `GET /api/ratings` - Listar todas as avaliações
- `POST /api/ratings` - Salvar nova avaliação
- `GET /api/ratings/stats` - Estatísticas das avaliações

## 📱 Páginas

- `/` - Página principal com experiência imersiva
- `/admin` - Painel de administração com estatísticas

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `MONGODB_URI`: Sua string de conexão do MongoDB Atlas
3. Deploy automático a cada push

### Outros Provedores

Configure as variáveis de ambiente necessárias no seu provedor de hosting.

## 🔒 Segurança

- Credenciais do banco armazenadas em variáveis de ambiente
- Validação de dados nas APIs
- Fallback para localStorage em caso de falha de conexão
- IPs restritos no MongoDB Atlas para produção

## 📈 Monitoramento

- Estatísticas em tempo real no painel administrativo
- Logs de erro no console
- Métricas de engajamento dos usuários
- Backup automático no MongoDB Atlas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação do MongoDB Atlas
- Verifique os logs do console

---

**Desenvolvido com ❤️ para conscientização sobre Miastenia Gravis**
