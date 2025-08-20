# Guia de Deploy para Vercel com MongoDB Atlas

## Pré-requisitos

1. **Conta na Vercel**: Crie uma conta em [vercel.com](https://vercel.com)
2. **Projeto no GitHub/GitLab/Bitbucket**: Seu código deve estar em um repositório
3. **MongoDB Atlas configurado**: Cluster funcionando com string de conexão

## Passo 1: Preparar o Projeto

### 1.1 Verificar arquivos de configuração
Seu projeto já está bem configurado com:
- ✅ `package.json` com scripts corretos
- ✅ `next.config.mjs` configurado
- ✅ Conexão MongoDB configurada em `lib/mongodb.js`

### 1.2 Criar arquivo .env.local (se não existir)
```bash
# Copie o env.example para .env.local
cp env.example .env.local
```

## Passo 2: Configurar MongoDB Atlas para Produção

### 2.1 Configurar IP Whitelist no MongoDB Atlas
1. Acesse [cloud.mongodb.com](https://cloud.mongodb.com)
2. Vá para seu cluster
3. Clique em "Network Access"
4. Clique em "Add IP Address"
5. **IMPORTANTE**: Clique em "Allow Access from Anywhere" (0.0.0.0/0)
   - Isso permite que a Vercel acesse seu banco de dados

### 2.2 Verificar usuário do banco
1. Vá para "Database Access"
2. Certifique-se de que seu usuário tem permissões adequadas
3. Anote a string de conexão completa

## Passo 3: Configurar Variáveis de Ambiente na Vercel

### 3.1 Acessar configurações do projeto
1. Acesse [vercel.com](https://vercel.com)
2. Vá para seu projeto `miastenia-gravis-app`
3. Clique na aba "Settings"
4. Clique em "Environment Variables"

### 3.2 Adicionar variável MONGODB_URI
1. Clique em "Add New"
2. Configure:
   - **Name**: `MONGODB_URI`
   - **Value**: `mongodb+srv://seuusuario:suasenha@seucluster.mongodb.net/miastenia-gravis-db?retryWrites=true&w=majority`
   - **Environment**: Selecione "Production", "Preview" e "Development"

**IMPORTANTE**: 
- Substitua pelos seus valores reais da string de conexão
- Não use aspas
- Certifique-se de que a string está completa
- Selecione todos os ambientes para garantir que funcione em todos os deploys

### 3.3 Salvar configuração
1. Clique em "Save"
2. Aguarde a confirmação de que a variável foi adicionada

## Passo 4: Fazer Deploy Automático

### 4.1 Push para GitHub
Como seu projeto já está conectado à Vercel, basta fazer push para o GitHub:

```bash
git add .
git commit -m "Configuração para deploy com MongoDB Atlas"
git push origin main
```

### 4.2 Deploy automático
- A Vercel detectará automaticamente o push
- Iniciará o build automaticamente
- Você pode acompanhar o progresso na dashboard da Vercel

### 4.3 Verificar se o deploy automático está ativo
1. Na dashboard da Vercel, vá para seu projeto
2. Clique em "Settings" > "Git"
3. Verifique se "Auto Deploy" está ativado
4. Confirme que o branch correto está selecionado (geralmente `main` ou `master`)

## Passo 5: Verificar o Deploy

### 5.1 Verificar logs
1. Na dashboard da Vercel, vá para seu projeto
2. Clique na aba "Functions" para ver as funções serverless
3. Verifique se não há erros nos logs

### 5.2 Testar a aplicação
1. Acesse a URL fornecida pela Vercel
2. Teste as funcionalidades que usam MongoDB
3. Verifique se as APIs estão funcionando

## Passo 6: Configurações Adicionais (Opcional)

### 6.1 Domínio personalizado
1. Na dashboard da Vercel, vá para "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruído

### 6.2 Variáveis de ambiente por ambiente
Você pode configurar variáveis diferentes para:
- **Production**: Produção
- **Preview**: Branches de desenvolvimento
- **Development**: Local

## Troubleshooting

### Erro: "Invalid/Missing environment variable: MONGODB_URI"
- Verifique se a variável está configurada na Vercel
- Certifique-se de que não há espaços extras
- Verifique se a string de conexão está completa

### Erro: "MongoNetworkError: connect ECONNREFUSED"
- Verifique se o IP 0.0.0.0/0 está na whitelist do MongoDB Atlas
- Verifique se as credenciais estão corretas

### Erro: "MongoServerSelectionError"
- Verifique se o cluster está ativo no MongoDB Atlas
- Verifique se o nome do cluster na string de conexão está correto

### Build falha
- Verifique os logs de build na Vercel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se não há erros de sintaxe no código

## Comandos úteis

### Testar conexão localmente
```bash
npm run test:mongodb
```

### Build local para testar
```bash
npm run build
```

### Verificar variáveis de ambiente
```bash
# No terminal da Vercel (se disponível)
echo $MONGODB_URI
```

## Links úteis

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Suporte

Se encontrar problemas:
1. Verifique os logs na dashboard da Vercel
2. Teste a conexão MongoDB localmente
3. Verifique a documentação oficial
4. Consulte os fóruns da comunidade
