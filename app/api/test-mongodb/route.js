import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    // Conectar ao MongoDB
    const client = await clientPromise;
    const db = client.db("miastenia-gravis-db"); // Substitua pelo nome do seu banco de dados
    
    // Testar a conexão listando as coleções
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com MongoDB Atlas estabelecida com sucesso!',
      collections: collections.map(col => col.name),
      database: db.databaseName
    });
    
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao conectar com MongoDB Atlas',
      error: error.message
    }, { status: 500 });
  }
}
