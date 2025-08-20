import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("miastenia-gravis-db");
    const collection = db.collection("ratings");
    
    // Buscar todas as avaliações
    const ratings = await collection.find({}).toArray();
    
    // Calcular estatísticas
    const total = ratings.length;
    const average = total > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    
    // Contar cada avaliação
    const ratingCounts = {};
    for (let i = 0; i <= 4; i++) {
      ratingCounts[i] = ratings.filter(r => r.rating === i).length;
    }
    
    // Avaliações por período (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRatings = ratings.filter(r => 
      new Date(r.timestamp) >= sevenDaysAgo
    );
    
    // Avaliações por período (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyRatings = ratings.filter(r => 
      new Date(r.timestamp) >= thirtyDaysAgo
    );
    
    return NextResponse.json({
      success: true,
      stats: {
        total: total,
        average: Math.round(average * 100) / 100, // Arredondar para 2 casas decimais
        ratingCounts: ratingCounts,
        recent: {
          last7Days: recentRatings.length,
          last30Days: monthlyRatings.length
        },
        distribution: {
          excellent: ratingCounts[4],
          good: ratingCounts[3],
          neutral: ratingCounts[2],
          poor: ratingCounts[1],
          veryPoor: ratingCounts[0]
        }
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    }, { status: 500 });
  }
}
