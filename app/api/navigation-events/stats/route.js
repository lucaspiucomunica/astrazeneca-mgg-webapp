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
    
    // Contar total de eventos
    const totalEvents = await collection.countDocuments();
    
    // Agrupar por página
    const pageViews = await collection.aggregate([
      {
        $match: { eventType: 'page_view' }
      },
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    // Criar objeto com contagens por página
    const pageStats = {
      home: 0,
      depoimentos: 0,
      associacoes: 0,
      quiz: 0,
      'disease-mechanism': 0
    };
    
    pageViews.forEach(page => {
      if (page._id === 'testimonials') {
        pageStats.depoimentos = page.count;
      } else if (page._id === 'associations') {
        pageStats.associacoes = page.count;
      } else if (page._id === 'home') {
        pageStats.home = page.count;
      } else if (page._id === 'quiz') {
        pageStats.quiz = page.count;
      } else if (page._id === 'disease-mechanism') {
        pageStats['disease-mechanism'] = page.count;
      }
    });
    
    // Estatísticas por dia (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await collection.aggregate([
      {
        $match: { 
          eventType: 'page_view',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            page: '$page'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]).toArray();
    
    return Response.json({ 
      success: true, 
      stats: {
        totalEvents,
        pageViews: pageStats,
        dailyStats,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao gerar estatísticas de navegação:', error);
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}