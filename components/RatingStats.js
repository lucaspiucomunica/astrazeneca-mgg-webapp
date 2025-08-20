'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Star } from 'lucide-react';

const RatingStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ratings/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Erro ao carregar estatísticas');
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <p>Erro ao carregar estatísticas: {error}</p>
          <button 
            onClick={fetchStats}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 5: return 'Excelente';
      case 4: return 'Bom';
      case 3: return 'Neutro';
      case 2: return 'Ruim';
      case 1: return 'Muito Ruim';
      default: return 'N/A';
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return 'bg-emerald-500';
      case 4: return 'bg-green-500';
      case 3: return 'bg-yellow-500';
      case 2: return 'bg-orange-500';
      case 1: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-purple-800">Estatísticas das Avaliações</h3>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-700 font-medium">Total de Avaliações</span>
          </div>
          <p className="text-2xl font-bold text-purple-800 mt-1">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Média Geral</span>
          </div>
          <p className="text-2xl font-bold text-green-800 mt-1">{stats.average}/5</p>
        </div>

        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Últimos 7 dias</span>
          </div>
          <p className="text-2xl font-bold text-blue-800 mt-1">{stats.recent.last7Days}</p>
        </div>
      </div>

      {/* Distribuição das avaliações */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Distribuição das Avaliações</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingCounts[rating];
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-24">
                  <div className={`w-3 h-3 min-w-3 min-h-3 rounded-full ${getRatingColor(rating)}`}></div>
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {getRatingLabel(rating)}
                  </span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getRatingColor(rating)} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Resumo</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Excelente (5):</span>
            <p className="font-semibold text-emerald-600">{stats.distribution.excellent}</p>
          </div>
          <div>
            <span className="text-gray-600">Bom (4):</span>
            <p className="font-semibold text-green-600">{stats.distribution.good}</p>
          </div>
          <div>
            <span className="text-gray-600">Neutro (3):</span>
            <p className="font-semibold text-yellow-600">{stats.distribution.neutral}</p>
          </div>
          <div>
            <span className="text-gray-600">Ruim (2):</span>
            <p className="font-semibold text-orange-600">{stats.distribution.poor}</p>
          </div>
          <div>
            <span className="text-gray-600">Muito ruim (1):</span>
            <p className="font-semibold text-red-600">{stats.distribution.veryPoor}</p>
          </div>
        </div>
      </div>

      {/* Botão de atualizar */}
      <div className="mt-4 text-center">
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Atualizar Estatísticas
        </button>
      </div>
    </div>
  );
};

export default RatingStats;
