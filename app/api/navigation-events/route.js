import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Cache da conexão para desenvolvimento
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db('miastenia_app');
    const collection = db.collection('navigation_events');
    
    const events = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    return Response.json({ 
      success: true, 
      events,
      total: events.length
    });
  } catch (error) {
    console.error('Erro ao buscar eventos de navegação:', error);
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventType, page, timestamp, data = {} } = body;
    
    if (!eventType || !page) {
      return Response.json({ 
        success: false, 
        message: 'Campos eventType e page são obrigatórios' 
      }, { status: 400 });
    }
    
    const client = await connectToDatabase();
    const db = client.db('miastenia_app');
    const collection = db.collection('navigation_events');
    
    const navigationEvent = {
      eventType,
      page,
      timestamp: timestamp || new Date().toISOString(),
      data,
      userAgent: request.headers.get('user-agent') || 'Unknown',
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(navigationEvent);
    
    return Response.json({ 
      success: true, 
      navigationEvent,
      eventId: result.insertedId 
    });
  } catch (error) {
    console.error('Erro ao salvar evento de navegação:', error);
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}