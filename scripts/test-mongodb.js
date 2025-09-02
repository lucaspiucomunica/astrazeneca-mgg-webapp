#!/usr/bin/env node

/**
 * Script para testar a conexão com o MongoDB Atlas
 * Execute com: node scripts/test-mongodb.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testMongoDBConnection() {
  // Verificar se a variável de ambiente existe
  if (!process.env.MONGODB_URI) {
    console.error('❌ Erro: MONGODB_URI não encontrada no arquivo .env.local');
    process.exit(1);
  }

  try {
    // Criar cliente MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    
    // Conectar ao MongoDB
    await client.connect();
    
    // Testar acesso ao banco de dados
    const db = client.db("miastenia-gravis-db");
    
    // Listar coleções
    const collections = await db.listCollections().toArray();
    
    // Testar operação de escrita
    const testCollection = db.collection("test_connection");
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: "Teste de conexão"
    };
    
    const result = await testCollection.insertOne(testDoc);
    
    // Limpar documento de teste
    await testCollection.deleteOne({ _id: result.insertedId });
    
    // Fechar conexão
    await client.close();
    
    console.log('\n🎉 Todos os testes passaram! MongoDB Atlas está configurado corretamente.');
    
  } catch (error) {
    console.error('\n❌ Erro ao conectar com MongoDB Atlas:');
    console.error(error.message);
    
    process.exit(1);
  }
}

// Executar teste
testMongoDBConnection();