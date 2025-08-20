import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// GET - Buscar todas as avaliações
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("miastenia-gravis-db");
    const collection = db.collection("ratings");
    
    const ratings = await collection.find({}).sort({ timestamp: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      ratings: ratings,
      total: ratings.length
    });
    
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar avaliações',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Salvar nova avaliação
export async function POST(request) {
  try {
    const body = await request.json();
    const { rating, timestamp } = body;
    
    // Validação básica
    if (rating === undefined || rating === null) {
      return NextResponse.json({
        success: false,
        message: 'Avaliação é obrigatória'
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("miastenia-gravis-db");
    const collection = db.collection("ratings");
    
    // Criar documento da avaliação
    const ratingDoc = {
      rating: rating,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date()
    };
    
    // Inserir no MongoDB
    const result = await collection.insertOne(ratingDoc);
    
    return NextResponse.json({
      success: true,
      message: 'Avaliação salva com sucesso!',
      ratingId: result.insertedId,
      rating: ratingDoc
    });
    
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao salvar avaliação',
      error: error.message
    }, { status: 500 });
  }
}
