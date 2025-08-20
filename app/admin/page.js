import RatingStats from '../../components/RatingStats';
import QuizStats from '../../components/QuizStats';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">
              Painel de Administração
            </h1>
            <p className="text-xl text-gray-600">
              Estatísticas da campanha de conscientização sobre Miastenia Gravis
            </p>
          </div>

          {/* Estatísticas das Avaliações */}
          <RatingStats />

          {/* Separador */}
          <div className="my-8 border-t border-gray-200"></div>

          {/* Estatísticas do Quiz */}
          <QuizStats />

          {/* Informações adicionais */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4">
                Sobre as Avaliações
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• As avaliações são coletadas automaticamente quando os usuários interagem com a experiência</li>
                <li>• Os dados são armazenados no MongoDB Atlas de forma segura</li>
                <li>• As estatísticas são atualizadas em tempo real</li>
                <li>• O sistema mantém backup no localStorage em caso de falha de conexão</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                Sobre o Tracking do Quiz
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Início:</strong> Quando o usuário entra na página do quiz</li>
                <li>• <strong>Abandono:</strong> Quando sai antes de completar (registra qual pergunta)</li>
                <li>• <strong>Conclusão:</strong> Quando completa todas as perguntas (registra pontuação)</li>
                <li>• <strong>Refazer:</strong> Quando clica em "Fazer Novamente"</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Como Interpretar os Dados
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Excelente (4):</strong> Experiência muito positiva</li>
                <li>• <strong>Bom (3):</strong> Experiência positiva</li>
                <li>• <strong>Neutro (2):</strong> Experiência neutra</li>
                <li>• <strong>Ruim (1):</strong> Experiência negativa</li>
                <li>• <strong>Muito Ruim (0):</strong> Experiência muito negativa</li>
              </ul>
            </div>
          </div>

          {/* Links úteis */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Links Úteis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a 
                href="/api/ratings" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors"
              >
                <span className="text-purple-600 font-medium">API de Avaliações</span>
              </a>
              <a 
                href="/api/ratings/stats" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors"
              >
                <span className="text-purple-600 font-medium">Estatísticas das Avaliações</span>
              </a>
              <a 
                href="/api/quiz-events" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span className="text-blue-600 font-medium">API de Eventos do Quiz</span>
              </a>
              <a 
                href="/api/quiz-events/stats" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span className="text-blue-600 font-medium">Estatísticas do Quiz</span>
              </a>
              <a 
                href="/api/test-mongodb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600 font-medium">Teste de Conexão</span>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-600">
            <p>© 2025 - Painel de Administração - Campanha de Conscientização sobre Miastenia Gravis</p>
          </div>
        </div>
      </div>
    </div>
  );
}
