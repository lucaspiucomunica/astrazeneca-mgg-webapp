import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("miastenia-gravis-db");
    const collection = db.collection("quiz_events");
    
    // Buscar todos os eventos do quiz
    const events = await collection.find({}).toArray();
    
    // Estatísticas básicas
    const total = events.length;
    
    // Contar cada tipo de evento
    const eventCounts = {
      quiz_started: events.filter(e => e.eventType === 'quiz_started').length,
      quiz_abandoned: events.filter(e => e.eventType === 'quiz_abandoned').length,
      quiz_completed: events.filter(e => e.eventType === 'quiz_completed').length,
      quiz_restarted: events.filter(e => e.eventType === 'quiz_restarted').length
    };
    
    // Estatísticas de conclusão
    const completionRate = eventCounts.quiz_started > 0 
      ? Math.round((eventCounts.quiz_completed / eventCounts.quiz_started) * 100)
      : 0;
    
    const abandonmentRate = eventCounts.quiz_started > 0 
      ? Math.round((eventCounts.quiz_abandoned / eventCounts.quiz_started) * 100)
      : 0;
    
    // Estatísticas de pontuação dos quizzes completados
    const completedQuizzes = events.filter(e => e.eventType === 'quiz_completed' && e.data && e.data.score !== undefined);
    let scoreStats = {
      totalCompleted: 0,
      averageScore: 0,
      scoreCounts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
      perfectScores: 0
    };
    
    if (completedQuizzes.length > 0) {
      const scores = completedQuizzes.map(e => e.data.score);
      scoreStats.totalCompleted = completedQuizzes.length;
      scoreStats.averageScore = Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100;
      
      // Contar cada pontuação
      for (let i = 0; i <= 4; i++) {
        scoreStats.scoreCounts[i] = scores.filter(score => score === i).length;
      }
      
      scoreStats.perfectScores = scores.filter(score => score === 4).length;
    }
    
    // Estatísticas de abandono por pergunta
    const abandonmentsByQuestion = {};
    const abandonedQuizzes = events.filter(e => e.eventType === 'quiz_abandoned' && e.data && e.data.questionIndex !== undefined);
    
    for (let i = 0; i < 4; i++) { // 4 perguntas no total
      abandonmentsByQuestion[i] = abandonedQuizzes.filter(e => e.data.questionIndex === i).length;
    }
    
    // Eventos por período (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEvents = events.filter(e => 
      new Date(e.timestamp) >= sevenDaysAgo
    );
    
    // Eventos por período (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyEvents = events.filter(e => 
      new Date(e.timestamp) >= thirtyDaysAgo
    );
    
    return NextResponse.json({
      success: true,
      stats: {
        total: total,
        eventCounts: eventCounts,
        rates: {
          completion: completionRate,
          abandonment: abandonmentRate
        },
        scores: scoreStats,
        abandonmentsByQuestion: abandonmentsByQuestion,
        recent: {
          last7Days: recentEvents.length,
          last30Days: monthlyEvents.length
        }
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas do quiz:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar estatísticas do quiz',
      error: error.message
    }, { status: 500 });
  }
}