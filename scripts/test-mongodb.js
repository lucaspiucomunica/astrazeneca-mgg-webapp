#!/usr/bin/env node

/**
 * Script para testar a conexão com o MongoDB Atlas
 * Execute com: node scripts/test-mongodb.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testMongoDBConnection() {
  console.log('🔍 Testando conexão com MongoDB Atlas...\n');

  // Verificar se a variável de ambiente existe
  if (!process.env.MONGODB_URI) {
    console.error('❌ Erro: MONGODB_URI não encontrada no arquivo .env.local');
    console.log('📝 Certifique-se de que o arquivo .env.local existe e contém sua string de conexão');
    process.exit(1);
  }

  console.log('✅ Variável MONGODB_URI encontrada');
  console.log('🔗 Tentando conectar...\n');

  try {
    // Criar cliente MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    
    // Conectar ao MongoDB
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar acesso ao banco de dados
    const db = client.db("miastenia-gravis-db");
    console.log(`📊 Banco de dados: ${db.databaseName}`);
    
    // Listar coleções
    const collections = await db.listCollections().toArray();
    console.log(`📁 Coleções encontradas: ${collections.length}`);
    
    if (collections.length > 0) {
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    } else {
      console.log('   (Nenhuma coleção encontrada - isso é normal para um banco novo)');
    }
    
    // Testar operação de escrita
    const testCollection = db.collection("test_connection");
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: "Teste de conexão"
    };
    
    const result = await testCollection.insertOne(testDoc);
    console.log(`✍️  Teste de escrita: OK (ID: ${result.insertedId})`);
    
    // Limpar documento de teste
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Documento de teste removido');
    
    // Fechar conexão
    await client.close();
    console.log('🔒 Conexão fechada');
    
    console.log('\n🎉 Todos os testes passaram! MongoDB Atlas está configurado corretamente.');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Execute: npm run dev');
    console.log('   2. Acesse: http://localhost:3000');
    console.log('   3. Teste a funcionalidade de avaliação');
    console.log('   4. Verifique o painel admin em: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('\n❌ Erro ao conectar com MongoDB Atlas:');
    console.error(error.message);
    
    console.log('\n🔧 Possíveis soluções:');
    console.log('   1. Verifique se a string de conexão está correta');
    console.log('   2. Confirme se o usuário e senha estão corretos');
    console.log('   3. Verifique se o IP está liberado no MongoDB Atlas');
    console.log('   4. Consulte o guia em MONGODB_SETUP.md');
    
    process.exit(1);
  }
}

// Executar teste
testMongoDBConnection();
