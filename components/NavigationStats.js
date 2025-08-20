'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, Activity, Eye, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

const NavigationStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/navigation-events/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setLastUpdated(new Date().toLocaleString('pt-BR'));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erro ao conectar com a API');
      console.error('Erro ao buscar estatísticas de navegação:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Activity className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Erro ao carregar dados</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={fetchStats}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Dados para o gráfico de barras
  const chartData = [
    {
      name: 'Home',
      value: stats.pageViews.home || 0,
      color: '#6B7280'
    },
    {
      name: 'Depoimentos',
      value: stats.pageViews.depoimentos || 0,
      color: '#8B5CF6'
    },
    {
      name: 'Como Age',
      value: stats.pageViews['disease-mechanism'] || 0,
      color: '#F59E0B'
    },
    {
      name: 'Quiz',
      value: stats.pageViews.quiz || 0,
      color: '#3B82F6'
    },
    {
      name: 'Associações',
      value: stats.pageViews.associacoes || 0,
      color: '#10B981'
    }
  ];

  const totalPageViews = Object.values(stats.pageViews).reduce((sum, value) => sum + value, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Eye className="w-8 h-8 text-green-600" />
            Estatísticas de Navegação
          </h2>
          <p className="text-gray-600 mt-1">
            Acessos às páginas de depoimentos e associações
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {/* Home */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-4 border-l-4 border-gray-500">
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Home</p>
            <p className="text-2xl font-bold text-gray-800">{stats.pageViews.home || 0}</p>
            <p className="text-gray-600 text-xs">acessos</p>
          </div>
        </div>

        {/* Depoimentos */}
        <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
          <div className="text-center">
            <p className="text-purple-600 text-sm font-medium">Depoimentos</p>
            <p className="text-2xl font-bold text-purple-800">{stats.pageViews.depoimentos || 0}</p>
            <p className="text-purple-600 text-xs">acessos</p>
          </div>
        </div>

        {/* Como Age */}
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
          <div className="text-center">
            <p className="text-orange-600 text-sm font-medium">Como Age</p>
            <p className="text-2xl font-bold text-orange-800">{stats.pageViews['disease-mechanism'] || 0}</p>
            <p className="text-orange-600 text-xs">acessos</p>
          </div>
        </div>

        {/* Quiz */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">Quiz</p>
            <p className="text-2xl font-bold text-blue-800">{stats.pageViews.quiz || 0}</p>
            <p className="text-blue-600 text-xs">acessos</p>
          </div>
        </div>

        {/* Associações */}
        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-4 border-l-4 border-green-500">
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium">Associações</p>
            <p className="text-2xl font-bold text-green-800">{stats.pageViews.associacoes || 0}</p>
            <p className="text-green-600 text-xs">acessos</p>
          </div>
        </div>
      </div>

      {/* Card Total */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Total de Eventos de Navegação</p>
              <p className="text-3xl font-bold text-indigo-800">{stats.totalEvents}</p>
              <p className="text-indigo-600 text-sm">eventos registrados no sistema</p>
            </div>
            <div className="bg-indigo-500 rounded-full p-3">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Distribuição de Acessos por Página</h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Acessos']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparação de Páginas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Páginas Mais Acessadas</h4>
          <div className="space-y-3">
            {chartData
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map((page, index) => (
                <div key={page.name} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: page.color }}
                    ></div>
                    <span className="font-medium text-gray-800">{page.name}</span>
                  </div>
                  <span className="font-bold text-gray-600">{page.value}</span>
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Estatísticas Gerais</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total de Visualizações</span>
              <span className="font-bold text-gray-800">{totalPageViews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Média por Página</span>
              <span className="font-bold text-gray-800">{Math.round(totalPageViews / chartData.length)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Página Mais Popular</span>
              <span className="font-bold text-gray-800">
                {chartData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>📊 Total: {stats.totalEvents} eventos</span>
            <span>🔄 Última atualização: {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationStats;