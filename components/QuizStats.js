'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, Target, AlertCircle } from 'lucide-react';

const QuizStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quiz-events/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Erro ao carregar estatísticas do quiz');
      console.error('Erro ao buscar estatísticas do quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando estatísticas do quiz...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <p>Erro ao carregar estatísticas do quiz: {error}</p>
          <button 
            onClick={fetchStats}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }


  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-blue-800">Estatísticas do Quiz</h3>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Quiz Iniciados</span>
          </div>
          <p className="text-2xl font-bold text-blue-800 mt-1">{stats.eventCounts.quiz_started}</p>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Completados</span>
          </div>
          <p className="text-2xl font-bold text-green-800 mt-1">{stats.eventCounts.quiz_completed}</p>
        </div>

        <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-700 font-medium">Abandonados</span>
          </div>
          <p className="text-2xl font-bold text-red-800 mt-1">{stats.eventCounts.quiz_abandoned}</p>
        </div>

        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">Total de Eventos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
      </div>

      {/* Estatísticas de eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Eventos por tipo */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Eventos por Tipo</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">Quiz Iniciados</span>
              <span className="font-bold text-blue-800">{stats.eventCounts.quiz_started}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Quiz Completados</span>
              <span className="font-bold text-green-800">{stats.eventCounts.quiz_completed}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-700">Quiz Abandonados</span>
              <span className="font-bold text-red-800">{stats.eventCounts.quiz_abandoned}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-700">Quiz Reiniciados</span>
              <span className="font-bold text-purple-800">{stats.eventCounts.quiz_restarted}</span>
            </div>
          </div>
        </div>

        {/* Taxas de engajamento */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Taxas de Engajamento</h4>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-green-700">Taxa de Conclusão</span>
                <span className="font-bold text-green-800">{stats.rates.completion}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.rates.completion}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-red-700">Taxa de Abandono</span>
                <span className="font-bold text-red-800">{stats.rates.abandonment}%</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.rates.abandonment}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Abandono por pergunta */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Abandono por Pergunta</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {Object.entries(stats.abandonmentsByQuestion).map(([questionIndex, count]) => (
            <div key={questionIndex} className="p-3 bg-orange-50 rounded-lg text-center">
              <span className="text-sm font-medium text-orange-700">Pergunta {parseInt(questionIndex) + 1}</span>
              <p className="font-bold text-orange-800 text-lg">{count}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Botão de atualizar */}
      <div className="mt-4 text-center">
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Atualizar Estatísticas do Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizStats;