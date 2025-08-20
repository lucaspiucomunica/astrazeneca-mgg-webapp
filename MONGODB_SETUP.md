# Configuração do MongoDB Atlas

Este guia explica como configurar o MongoDB Atlas para o projeto Miastenia Gravis App.

## 1. Criar conta no MongoDB Atlas

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com)
2. Clique em "Try Free" para criar uma conta gratuita
3. Preencha seus dados e crie a conta

## 2. Criar um Cluster

1. Após fazer login, clique em "Build a Database"
2. Escolha o plano "FREE" (M0)
3. Selecione um provedor (AWS, Google Cloud ou Azure)
4. Escolha uma região próxima ao Brasil
5. Clique em "Create"

## 3. Configurar Segurança

### 3.1 Criar usuário do banco de dados

1. Na seção "Security" > "Database Access"
2. Clique em "Add New Database User"
3. Escolha "Password" como método de autenticação
4. Digite um username e senha (guarde essas informações!)
5. Em "Database User Privileges", selecione "Read and write to any database"
6. Clique em "Add User"

### 3.2 Configurar acesso à rede

1. Na seção "Security" > "Network Access"
2. Clique em "Add IP Address"
3. Para desenvolvimento, clique em "Allow Access from Anywhere" (0.0.0.0/0)
4. Para produção, adicione apenas os IPs específicos
5. Clique em "Confirm"

## 4. Obter a String de Conexão

1. No dashboard do cluster, clique em "Connect"
2. Escolha "Connect your application"
3. Selecione "Node.js" como driver
4. Copie a string de conexão

A string será algo como:
```
mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

## 5. Configurar as Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione a seguinte linha:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/miastenia-gravis-db?retryWrites=true&w=majority
```

**Importante:**
- Substitua `<username>` pelo seu nome de usuário
- Substitua `<password>` pela sua senha
- Substitua `cluster0.abc123.mongodb.net` pela URL do seu cluster
- Adicione `/miastenia-gravis-db` após a URL para especificar o nome do banco de dados

## 6. Testar a Conexão

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse a URL de teste:
```
http://localhost:3000/api/test-mongodb
```

3. Você deve ver uma resposta como:
```json
{
  "success": true,
  "message": "Conexão com MongoDB Atlas estabelecida com sucesso!",
  "collections": [],
  "database": "miastenia-gravis-db"
}
```

## 7. Estrutura do Banco de Dados

O projeto criará automaticamente as seguintes coleções:

### `ratings`
Armazena as avaliações dos usuários sobre a experiência.

Exemplo de documento:
```json
{
  "_id": "ObjectId(...)",
  "rating": 4,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

## 8. Solução de Problemas

### Erro de conexão
- Verifique se a string de conexão está correta
- Confirme se o usuário e senha estão corretos
- Verifique se o IP está liberado no Network Access

### Erro de autenticação
- Verifique se o usuário tem permissões de leitura e escrita
- Confirme se a senha está correta

### Erro de rede
- Verifique se o IP está liberado no MongoDB Atlas
- Para desenvolvimento, use "Allow Access from Anywhere"

## 9. Deploy em Produção

Para deploy em produção:

1. Configure as variáveis de ambiente no seu provedor de hosting
2. Adicione apenas os IPs do seu servidor no Network Access
3. Use um usuário com permissões específicas (não admin)
4. Considere usar um cluster pago para melhor performance

## 10. Monitoramento

No MongoDB Atlas, você pode:
- Monitorar o uso do banco de dados
- Ver logs de conexão
- Configurar alertas
- Fazer backup automático

---

**Nota:** Nunca commite o arquivo `.env.local` no Git. Ele já está no `.gitignore` para proteger suas credenciais.
