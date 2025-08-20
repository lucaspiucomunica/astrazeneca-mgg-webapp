import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// GET - Buscar todos os eventos do quiz
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("miastenia-gravis-db");
    const collection = db.collection("quiz_events");
    
    const events = await collection.find({}).sort({ timestamp: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      events: events,
      total: events.length
    });
    
  } catch (error) {
    console.error('Erro ao buscar eventos do quiz:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar eventos do quiz',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Salvar novo evento do quiz
export async function POST(request) {
  try {
    const body = await request.json();
    const { eventType, timestamp, data } = body;
    
    // Validação básica
    if (!eventType) {
      return NextResponse.json({
        success: false,
        message: 'Tipo de evento é obrigatório'
      }, { status: 400 });
    }
    
    // Validar tipos de eventos permitidos
    const allowedEventTypes = [
      'quiz_started',
      'quiz_abandoned', 
      'quiz_completed',
      'quiz_restarted'
    ];
    
    if (!allowedEventTypes.includes(eventType)) {
      return NextResponse.json({
        success: false,
        message: 'Tipo de evento não permitido'
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("miastenia-gravis-db");
    const collection = db.collection("quiz_events");
    
    // Criar documento do evento
    const eventDoc = {
      eventType: eventType,
      timestamp: timestamp || new Date().toISOString(),
      data: data || {},
      createdAt: new Date()
    };
    
    // Inserir no MongoDB
    const result = await collection.insertOne(eventDoc);
    
    return NextResponse.json({
      success: true,
      message: 'Evento do quiz salvo com sucesso!',
      eventId: result.insertedId,
      event: eventDoc
    });
    
  } catch (error) {
    console.error('Erro ao salvar evento do quiz:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao salvar evento do quiz',
      error: error.message
    }, { status: 500 });
  }
}