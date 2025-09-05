'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, CheckCircle, XCircle, ChevronRight, Award, FileText, Headphones, Home, Video, ExternalLink, ArrowLeft, Phone, Mail, Instagram, Users, Frown, Meh, Smile, Heart, Activity, ArrowDown, Zap, MessageCircle, Shield, AlertTriangle } from 'lucide-react';
import { trackRating, trackQuizEvent, trackNavigationEvent, initializeDataLayer, initializeKioskMode } from '../lib/datalayer';
import AssetCache from './AssetCache';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const MiasteniaGravisApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [resetProgress, setResetProgress] = useState(0);

  // Refs para controlar os players de áudio e vídeo
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const heroVideoRef = useRef(null);
  const swiperRef = useRef(null);

  // Dados das associações
  const associations = [
    {
      id: 1,
      name: "Casa Hunter",
      phones: ["(11) 2776-3647", "(11) 99435-1299"],
      email: "casahunter@casahunter.org.br",
      instagram: null
    },
    {
      id: 2,
      name: "AFAG Brasil",
      fullName: "Associação dos Familiares, Amigos e Pessoas com Doenças Graves, Raras e Deficiências",
      phones: ["0800-777-2902", "(19) 99632-6225"],
      email: "contato@afag.org.br",
      instagram: null
    },
    {
      id: 3,
      name: "ABRAMI",
      fullName: "Associação Brasileira de Miastenia",
      phones: ["(11) 96801-5987"],
      email: "contato@abrami.org.br",
      instagram: null
    },
    {
      id: 4,
      name: "AMMI",
      fullName: "Associação Mineira de Miastenia",
      phones: [],
      email: null,
      instagram: "instagram.com/ammi_associacao"
    }
  ];

  // Função para controlar reprodução
  const togglePlayPause = () => {
    const currentTestimonialData = testimonials[currentTestimonial];
    const mediaType = currentTestimonialData.type;
    
    // Usar o elemento HTML existente (não substituir pelo cache)
    const currentMedia = mediaType === 'video' ? videoRef.current : audioRef.current;
    
    if (currentMedia) {
      if (isPlaying) {
        currentMedia.pause();
      } else {
        currentMedia.play().catch(error => {
          console.error('Erro ao reproduzir mídia:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Função para parar reprodução ao trocar de depoimento
  const stopCurrentMedia = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (heroVideoRef.current) {
      heroVideoRef.current.pause();
      heroVideoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsHeroVideoPlaying(false);
  };

  // Função para iniciar o vídeo hero
  const playHeroVideo = () => {
    setIsHeroVideoPlaying(true);
    
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(error => {
        console.error('Erro ao reproduzir vídeo:', error);
      });
    }
  };

  // Função para lidar com o fim da reprodução
  const handleMediaEnded = () => {
    setIsPlaying(false);
  };

  // Função para trocar de depoimento
  const changeTestimonial = (index) => {
    stopCurrentMedia();
    setCurrentTestimonial(index);
    setShowTranscription(false);
  };

  // Função para resetar todos os estados dos depoimentos
  const resetTestimonials = () => {
    stopCurrentMedia();
    setCurrentTestimonial(0);
    setShowTranscription(false);
  };

  // Função para lidar com mudança de slide do Swiper
  const handleSlideChange = (swiper) => {
    stopCurrentMedia();
    setCurrentTestimonial(swiper.activeIndex);
    setShowTranscription(false);
  };

  // Efeito para inicializar o DataLayer (apenas uma vez)
  useEffect(() => {
    // Inicializar DataLayer
    initializeDataLayer();

    // Inicializar modo quiosque (heartbeat + monitor de inatividade)
    // 30 minutos de inatividade por padrão
    initializeKioskMode(30);

    // Tracking da página inicial (home) apenas no carregamento inicial
    saveNavigationEvent('page_view', 'home', {
      fromPage: null,
      timestamp: new Date().toISOString(),
      isInitialLoad: true
    });

    // Adicionar estilos customizados do Swiper
    const swiperCustomStyles = `
      .testimonials-swiper {
        position: relative;
      }

      .swiper-pagination-bullet-custom {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #d1d5db;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 1;
      }

      .swiper-pagination-bullet-active-custom {
        background-color: #7c3aed;
        width: 32px;
        border-radius: 6px;
      }

      .swiper-pagination-bullet-custom:hover {
        background-color: #9ca3af;
      }

      .swiper {
        height: auto !important;
      }

      .swiper-slide {
        height: auto !important;
      }
    `;

    if (!document.querySelector('#swiper-custom-styles')) {
      const style = document.createElement('style');
      style.id = 'swiper-custom-styles';
      style.textContent = swiperCustomStyles;
      document.head.appendChild(style);
    }
  }, []); // Executar apenas uma vez no mount

  // Efeito para controlar comportamentos quando a página muda
  useEffect(() => {
    
    if (currentPage !== 'testimonials') {
      stopCurrentMedia();
    }
    if (currentPage !== 'home') {
      setIsHeroVideoPlaying(false);
      if (heroVideoRef.current) {
        heroVideoRef.current.pause();
        heroVideoRef.current.currentTime = 0;
      }
    }
    
    // Log para debug
    console.log('📊 Página alterada para:', currentPage);
    
    // Tracking do início do quiz
    if (currentPage === 'quiz' && currentQuestionIndex === 0 && !quizCompleted && !showResult) {
      saveQuizEvent('quiz_started', {
        totalQuestions: quizQuestions.length,
        startTime: new Date().toISOString()
      });
    }
    
    // Reiniciar quiz quando sair da página do quiz
    if (currentPage !== 'quiz') {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      setQuizCompleted(false);
    }
  }, [currentPage]);

  // Depoimentos fictícios com transcrições
  const testimonials = [
    {
      id: 1,
      name: "G.",
      description: "Paciente de Miastenia Gravis",
      type: "audio",
      mediaUrl: "/audio/guilherme.mp3",
      transcription: "Tive o diagnóstico da Miastenia no ano de 2022. A visão ficou muito turva. Eu procurei oftalmologistas, me serviu alguma coisa relativo apenas a visão. Por volta de 4 a 5 meses passei por três oftalmologista, oito, neurologista. No nono neurologista eu consegui ter o diagnóstico da Miastenia, então ela só foi agravando após o diagnóstico. Eu não queria acreditar no que realmente estava acontecendo comigo, porque eu tinha uma vida normal, jogava bola, fazia academia.\n\nMinha vida era a vida movimentada. Acabou que eu fiquei assim, bem sedentário mesmo. Com os medicamentos, com depressão de não poder fazer as coisas que eu gosto de fazer, não poder jogar bola, não poder praticar um esporte. Eu ganhei muito peso. Eu saí de 91 para 119kg. Cheguei a ficar internado, tive uma falta de ar muito grande. Então foi acontecendo assim, uma coisa atrás da outra.\n\nTinha um ano que eu tinha divorciado, a empresa queria me desligar por causa da Miastenia, parece que você está no fundo do poço. E aí eu fiz um propósito que se eu saindo dali eu ia ter uma vida totalmente diferente e eu não entreguei. Fui mudando minha vida por completo. Hoje eu sei que a qualidade de vida só depende de mim, eu seguir o tratamento da melhor forma possível, então a vida que eu levo hoje é uma vida nova, uma vida diferente, mas com esportes novos, andar de bicicleta, fazer uma caminhada, poder ir na academia. Eu fiz um controle alimentar e de 119kg eu fui para 91kg. Eu me transformei sabendo amar, gostar e aproveitar melhor a vida."
    },
    {
      id: 2,
      name: "K.",
      description: "Paciente de Miastenia Gravis",
      type: "audio",
      mediaUrl: "/audio/kenia.mp3",
      transcription: "Tive o diagnóstico de minha Miastenia Gravis em 2020 e profissionalmente hoje eu sou advogada. Os primeiros sintomas surgiram com fraquezas e fadiga. Eu tinha uma fraqueza tão grande, mas tão grande, que eu não conseguia dirigir. E eu procurei uma médica em São Paulo. Essa médica foi a primeira médica a me dar atenção. Aí ela começou a me fazer várias perguntas e ela pediu uma avaliação rigorosa com o neurologista.\n\nE foi a partir daí que começou a investigação. Aí demorou um ano para eu poder fechar o diagnóstico e depois do diagnóstico eu comecei tratamentos, mas nada dava um resultado muito bom. Eu tive muitas crises, muitas internações, tive uma crise grave que eu precisei ficar na UTI e precisei trancar a faculdade por diversas vezes. Mas terminei e o diagnóstico da minha Miastenia Gravis na minha vida e me possibilitou enxergar a vida com outros olhos.\n\nNão é romantizar, mas depois que você tem de você tem que transformar. E é isso que eu escolhi fazer. Eu optei por viver um dia de cada vez, com qualidade de vida e da melhor forma possível."
    },
    {
      id: 3,
      name: "Gabriel, Lua e Tayná",
      description: "Pacientes de Miastenia Gravis",
      type: "video",
      mediaUrl: "/video/miastenia-gravis.webm",
      transcription: null
    },
  ];

  // Perguntas do Quiz
  const quizQuestions = [
    {
      question: "O que é a Miastenia Gravis?",
      options: [
        "Uma doença que afeta os ossos",
        "Uma doença rara que causa fraqueza muscular",
        "Uma infecção viral",
        "Uma doença hereditária do sangue"
      ],
      correct: 1,
      explanation: "<p style='margin-bottom: 12px'>A Miastenia Gravis é uma doença rara que interfere na comunicação entre nervos e músculos, causando fraqueza muscular intensa e cansaço<sup>1</sup>.</p><p>Esses sintomas podem dificultar mesmo as tarefas mais simples do dia a dia, como escovar os dentes, pentear o cabelo e abrir um guarda-chuva​<sup>1–3​</sup>.</p>"
    },
    {
      question: "Além da fraqueza muscular, quais outros principais sintomas a Miastenia Gravis pode causar?",
      options: [
        "Febre alta constante e enjoo",
        "Visão dupla e pálpebras caídas",
        "Dor nas articulações e tontura",
        "Perda de memória e confusão mental"
      ],
      correct: 1,
      explanation: "<p>Problemas oculares como visão dupla (diplopia) e pálpebras caídas (ptose) são sintomas característicos da Miastenia Gravis<sup>2</sup>.</p>"
    },
    {
      question: "Qual profissional é essencial no diagnóstico da Miastenia Gravis?",
      options: [
        "Dermatologista",
        "Neurologista",
        "Cardiologista",
        "Ortopedista"
      ],
      correct: 1,
      explanation: "<p>Tanto o diagnóstico quanto o acompanhamento ao longo do tempo costuma ser feito por um neurologista — preferencialmente especializado em doenças neuromusculares <sup>1,2,4.</p>"
    },
    {
      question: "Pessoas com Miastenia Gravis podem levar uma vida ativa?",
      options: [
        "Não, ficam sempre acamadas",
        "Sim, com diagnóstico e manejo adequados",
        "Apenas algumas pessoas",
        "Somente com transplante"
      ],
      correct: 1,
      explanation: "<p>O manejo adequado permite que pessoas com Miastenia Gravis vivam com autonomia e qualidade de vida, já que gerencia os sintomas e busca a estabilização. Isso significa poder avistar novos horizontes e retomar planos <sup>1,2,4,6</sup>.</p>"
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === quizQuestions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      
      // Tracking de conclusão do quiz
      // score já está atualizado pelo handleAnswerSelect, não precisa somar +1 novamente
      saveQuizEvent('quiz_completed', {
        score: score,
        totalQuestions: quizQuestions.length,
        percentage: Math.round((score / quizQuestions.length) * 100),
        completionTime: new Date().toISOString()
      });
    }
  };

  const resetQuiz = () => {
    // Tracking de refazer quiz
    saveQuizEvent('quiz_restarted', {
      previousScore: score,
      totalQuestions: quizQuestions.length,
      previousPercentage: Math.round((score / quizQuestions.length) * 100),
      restartTime: new Date().toISOString()
    });
    
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  // Função para salvar eventos do quiz
  const saveQuizEvent = async (eventType, eventData = {}) => {
    // Disparar evento no DataLayer
    trackQuizEvent(eventType, eventData);
    
    try {
      // Salvar no MongoDB via API
      const response = await fetch('/api/quiz-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: eventType,
          timestamp: new Date().toISOString(),
          data: eventData
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Evento salvo com sucesso
      } else {
        console.error(`❌ Erro ao salvar evento ${eventType} no MongoDB:`, result.message);
      }
    } catch (error) {
      console.error(`❌ Erro ao conectar com a API para evento ${eventType}:`, error);
    }
  };

  // Função para salvar eventos de navegação
  const saveNavigationEvent = async (eventType, page, eventData = {}) => {
    // Disparar evento no DataLayer
    trackNavigationEvent(page, eventData);
    
    try {
      // Salvar no MongoDB via API
      const response = await fetch('/api/navigation-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: eventType,
          page: page,
          timestamp: new Date().toISOString(),
          data: eventData
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Evento salvo com sucesso
      } else {
        console.error(`❌ Erro ao salvar evento de navegação ${page} no MongoDB:`, result.message);
      }
    } catch (error) {
      console.error(`❌ Erro ao conectar com a API para evento de navegação ${page}:`, error);
    }
  };

  // Função para lidar com a avaliação
  const handleRating = async (rating) => {
    setSelectedRating(rating);
    setRatingSubmitted(true);
    setResetProgress(0);
    
    // Disparar evento no DataLayer
    trackRating(rating, {
      page: currentPage,
      user_interaction: 'rating_submitted'
    });
    
    try {
      // Salvar no MongoDB via API
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          timestamp: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Avaliação salva com sucesso
      } else {
        console.error('❌ Erro ao salvar no MongoDB:', result.message);
        // Fallback para localStorage em caso de erro
        const ratings = JSON.parse(localStorage.getItem('immersion_ratings') || '[]');
        const newRating = {
          rating,
          timestamp: new Date().toISOString()
        };
        ratings.push(newRating);
        localStorage.setItem('immersion_ratings', JSON.stringify(ratings));
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com a API:', error);
      // Fallback para localStorage em caso de erro
      const ratings = JSON.parse(localStorage.getItem('immersion_ratings') || '[]');
      const newRating = {
        rating,
        timestamp: new Date().toISOString()
      };
      ratings.push(newRating);
      localStorage.setItem('immersion_ratings', JSON.stringify(ratings));
    }
    
    // Barra de progresso fluída
    const startTime = Date.now();
    const duration = 5000; // 5 segundos
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setResetProgress(progress);
      
      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setRatingSubmitted(false);
        setSelectedRating(null);
        setResetProgress(0);
      }
    };
    
    requestAnimationFrame(updateProgress);
  };

  // Função para obter ícone baseado na avaliação
  const getRatingIcon = (rating) => {
    switch (rating) {
      case 1:
        return <Frown className="w-8 h-8 text-red-600" />;
      case 2:
        return <Frown className="w-8 h-8 text-orange-600" />;
      case 3:
        return <Meh className="w-8 h-8 text-yellow-600" />;
      case 4:
        return <Smile className="w-8 h-8 text-green-600" />;
      case 5:
        return <Heart className="w-8 h-8 text-emerald-600" />;
      default:
        return <Meh className="w-8 h-8 text-gray-600" />;
    }
  };



  const navigateTo = (page) => {
    // Tracking de abandono do quiz se sair da página quiz sem completar
    if (currentPage === 'quiz' && page !== 'quiz' && !quizCompleted) {
      saveQuizEvent('quiz_abandoned', {
        questionIndex: currentQuestionIndex,
        totalQuestions: quizQuestions.length,
        currentScore: score,
        timeSpent: null // Poderia calcular tempo se tivéssemos startTime em state
      });
    }
    
    // Resetar depoimentos quando voltar para home ou sair da página de depoimentos
    if (currentPage === 'testimonials' && page !== 'testimonials') {
      resetTestimonials();
    }
    
    // Tracking de navegação para todas as páginas
    saveNavigationEvent('page_view', page, {
      fromPage: currentPage,
      timestamp: new Date().toISOString()
    });
    
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Componente do Footer
  const Footer = () => (
    <div className="mt-8 border-t pt-6 border-gray-200">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-purple-800 mb-2 text-center">
          Acesse o site da campanha e saiba mais
        </h3>
        
        <div className="mt-6 inline-block p-4 bg-white rounded-lg shadow-lg">
          <img 
            src="/images/qr-code.png" 
            alt="QR Code para acessar o site" 
            className="w-32 h-32 mx-auto"
          />
          <p className="text-sm text-gray-600 mt-2">
            Tire uma foto para acessar em casa
          </p>
        </div>
      </div>

      {/* Sistema de Avaliação */}
      <div className="mt-8 border-t pt-6 border-gray-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-purple-800 mb-6">
            Como foi sua experiência nesta imersão?
          </h3>
          
                     {!ratingSubmitted ? (
             <div className="flex justify-center items-center gap-4 mb-6">
               {[1, 2, 3, 4, 5].map((rating) => (
                 <button
                   key={rating}
                   onClick={() => handleRating(rating)}
                   className="flex flex-col items-center gap-2 group cursor-pointer transition-all hover:scale-110"
                 >
                   {/* Ícone do rosto */}
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                     rating === 1 ? 'bg-red-100 group-hover:bg-red-200' :
                     rating === 2 ? 'bg-orange-100 group-hover:bg-orange-200' :
                     rating === 3 ? 'bg-yellow-100 group-hover:bg-yellow-200' :
                     rating === 4 ? 'bg-green-100 group-hover:bg-green-200' :
                     'bg-emerald-100 group-hover:bg-emerald-200'
                   }`}>
                     {getRatingIcon(rating)}
                   </div>
                   
                   {/* Barra colorida */}
                   <div className={`w-12 h-3 rounded-full transition-all ${
                     rating === 1 ? 'bg-red-500' :
                     rating === 2 ? 'bg-orange-500' :
                     rating === 3 ? 'bg-yellow-500' :
                     rating === 4 ? 'bg-green-500' :
                     'bg-emerald-600'
                   }`}></div>
                 </button>
               ))}
             </div>
                     ) : (
                           <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-sm mx-auto">
                <div className="flex flex-col items-center gap-3">
                  <h4 className="text-lg font-bold text-green-800 text-center">
                    Obrigado por avaliar!
                  </h4>
                  
                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${resetProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
           )}
        </div>
      </div>

      {/* Seção de Referências */}
      <div className="mt-8 border-t pt-6 border-gray-200">
        <h3 className="text-lg font-bold text-purple-800 mb-4 text-left">
          Referências
        </h3>
        <div className="text-xs text-gray-600 space-y-2 max-w-4xl mx-auto">
          <p>1. Ministério da Saúde. Ministério da Saúde - PORTARIA CONJUNTA No 11, DE 23 DE MAIO DE 2022. Disponível em https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20220705_PCDT_Resumido_MIastenia_Gravis_final.pdf. Acessado em 25 de agosto de 2025.</p>
          <p>2. Suresh, A. B.Asuncion, R. M. D. Myasthenia Gravis. StatPearls (2023).</p>
          <p>3. Cunha, F. M. B., Scola, R. H. & Werk, L. C. Myasthenia gravis: Historical aspects. Arq Neuropsiquiatr 57, 531–536 (1999).</p>
          <p>4. GilhuN. E. et al. Myasthenia gravis. Nat Rev Dis Primers 5, (2019).</p>
          <p>5. Mukharesh, L. & Kaminski, H. J. A Neurologist&apos;s Perspective on Understanding Myhenia Gravis: Clinical Perspectives of Etiologic Factors, Diagnosis, and Preoperative Treatment. Thorac Surg Clin 29, 133–141 (2019).</p>
          <p>6. Uzawa, At al. Minimal symptom expression achievement over time in generalized myasthenia gravis. Acta Neurol Belg 123, 979–982 (2023).</p>
        </div>
      </div>

      <div className="mt-8 border-t pt-6 border-gray-200">
      <p className="text-center text-xs text-gray-600 text-sm">
      BR-43582. Material destinado ao público geral. Agosto/2025
      </p>
      <p className="text-center text-xs text-gray-600 text-sm mt-4">
      © AstraZeneca 2025. Todos os Direitos Reservados.
      </p>
      </div>
    </div>
  );

  // Página Principal
  if (currentPage === 'home') {
      return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Componente para gerenciar cache de assets no Kiosker.IO */}
      <AssetCache />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header da Campanha */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-purple-800 mb-4">A tempestade vai e a vida volta</h1>
              <p className="text-xl text-gray-600 mb-2">Você acaba de viver a experiência de como a Miastenia Gravis pode impactar o dia a dia de quem tem a doença.</p>
              <p className="text-lg text-gray-500">Mesmo ações cotidianas como escovar os dentes são desafiadoras em quadros de fraqueza muscular e fadiga extrema<sup>1</sup> — dois dos principais sintomas.</p>
            </div>

            {/* Vídeo Hero */}
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg aspect-video relative mx-auto">
              {!isHeroVideoPlaying ? (
                <div 
                  className="group cursor-pointer w-full h-full"
                  onClick={playHeroVideo}
                >
                  <img 
                    src="/images/thumb-video-hero.webp" 
                    alt="A tempestade vai e a vida volta" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-4 transform scale-100 group-hover:scale-110 transition-all">
                      <Play className="w-12 h-12 text-purple-600" />
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  ref={heroVideoRef}
                  src="/video/miastenia-gravis-hero.webm"
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setIsHeroVideoPlaying(false)}
                  preload="none"
                />
              )}
            </div>

            {/* Botões de Navegação estilo iOS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <button
                onClick={() => navigateTo('testimonials')}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              >
                <Headphones className="w-8 h-8" />
                <span className="font-semibold text-sm">Conheça histórias de pacientes (em áudio e vídeo)</span>
              </button>

              <button
                onClick={() => navigateTo('disease-mechanism')}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              >
                <Activity className="w-8 h-8" />
                <span className="font-semibold text-sm">Como a Miastenia Gravis age</span>
              </button>

              <button
                onClick={() => navigateTo('quiz')}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              >
                <Award className="w-8 h-8" />
                <span className="font-semibold text-sm">Teste seus conhecimentos</span>
              </button>

              <button
                onClick={() => navigateTo('associations')}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              >
                <Users className="w-8 h-8" />
                <span className="font-semibold text-sm">Saiba como procurar apoio</span>
              </button>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    );
  }

  // Páginas internas com botão voltar
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Componente para gerenciar cache de assets no Kiosker.IO */}
      <AssetCache />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Header com botão voltar */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h2 className="text-2xl font-bold text-purple-800">
              {currentPage === 'testimonials' && 'Depoimentos'}
              {currentPage === 'disease-mechanism' && 'Como a Miastenia Gravis Age'}
              {currentPage === 'quiz' && 'Quiz Educativo'}
              {currentPage === 'associations' && 'Associações de Apoio'}
            </h2>
            <div className="w-20"></div>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            {/* Página de Depoimentos */}
            {currentPage === 'testimonials' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                  Histórias de superação
                  </h3>
                  <p className="text-gray-600">
                  Ouça e assista a depoimentos de pessoas que convivem com a Miastenia Gravis
                  </p>
                </div>

                {/* Swiper Container */}
                <div className="testimonials-swiper bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 h-auto">
                  <Swiper
                    ref={swiperRef}
                    modules={[Pagination, A11y]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoHeight={true}
                    pagination={{
                      clickable: true,
                      el: '.swiper-pagination-custom',
                      bulletClass: 'swiper-pagination-bullet-custom',
                      bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                    }}
                    onSlideChange={handleSlideChange}
                    className="w-full"
                  >
                    {testimonials.map((testimonial, index) => (
                      <SwiperSlide key={testimonial.id}>
                        <div className="">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-purple-800">
                                {testimonial.name}
                              </h4>
                              <p className="text-gray-600 flex items-center gap-2">
                                {testimonial.description}
                                {testimonial.type === 'video' ? 
                                  <Video className="w-4 h-4" /> : 
                                  <Volume2 className="w-4 h-4" />
                                }
                              </p>
                            </div>
                            <button
                              onClick={togglePlayPause}
                              className="bg-purple-600 text-white p-4 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                            >
                              {isPlaying && currentTestimonial === index ? 
                                <Pause className="w-6 h-6" /> : 
                                <Play className="w-6 h-6" />
                              }
                            </button>
                          </div>

                          {/* Área do player de vídeo/áudio */}
                          {testimonial.type === 'video' ? (
                            <div className="mb-4 rounded-lg overflow-hidden aspect-video">
                              <video
                                ref={currentTestimonial === index ? videoRef : null}
                                src={testimonial.mediaUrl}
                                className="w-full h-full object-cover"
                                controls
                                onEnded={handleMediaEnded}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                preload="none"
                              />
                            </div>
                          ) : (
                            <div className="mb-4 bg-white bg-opacity-50 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <Volume2 className="w-5 h-5 text-purple-600" />
                                <span className="text-sm text-gray-700 font-medium">Depoimento em Áudio</span>
                              </div>
                              <audio
                                ref={currentTestimonial === index ? audioRef : null}
                                src={testimonial.mediaUrl}
                                className="w-full"
                                controls
                                onEnded={handleMediaEnded}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                preload="none"
                              />
                            </div>
                          )}

                          {/* Botão de transcrição - só aparece se houver transcrição */}
                          {testimonial.transcription && (
                            <button
                              onClick={() => setShowTranscription(!showTranscription)}
                              className="mb-4 text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
                            >
                              <FileText className="w-5 h-5" />
                              {showTranscription ? 'Ocultar' : 'Mostrar'} Transcrição
                            </button>
                          )}

                          {/* Transcrição */}
                          {showTranscription && testimonial.transcription && (
                            <div className="bg-white bg-opacity-70 rounded-lg p-4 mb-4">
                              <h5 className="font-semibold text-gray-800 mb-2">Transcrição:</h5>
                              <div className="text-gray-700 leading-relaxed">
                                {testimonial.transcription.split('\n\n').map((paragraph, index, array) => (
                                  <p key={index} className={index > 0 ? 'mt-4' : ''}>
                                    {index === 0 && '\"'}{paragraph}{index === array.length - 1 && '\"'}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Pagination */}
                  <div className="swiper-pagination-custom flex justify-center gap-2 mt-6"></div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                  <Headphones className="w-6 h-6 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Use os fones de ouvido para uma melhor experiência. Deslize para navegar entre os depoimentos.
                  </p>
                </div>
              </div>
            )}

            {/* Página Como a Miastenia Gravis Age */}
            {currentPage === 'disease-mechanism' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    Como a Miastenia Gravis Age
                  </h3>
                  <p className="text-gray-600">
                    Entenda como a doença afeta a comunicação entre nervos e músculos
                  </p>
                </div>

                {/* Cards Conectados */}
                <div className="space-y-6">
                  {/* Card 1 - Funcionamento Normal */}
                  <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-6 border-l-4 border-green-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500 rounded-full p-3 flex-shrink-0">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">
                        Nosso corpo precisa de uma boa comunicação entre os nervos e os músculos para funcionar direitinho e quem faz esse papel de mensageiro é a acetilcolina, um neurotransmissor essencial nessa conversa.<sup>2,5</sup>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seta de conexão */}
                  <div className="flex justify-center">
                    <ArrowDown className="w-8 h-8 text-orange-500" />
                  </div>

                  {/* Card 2 - O que acontece na MG */}
                  <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-500 rounded-full p-3 flex-shrink-0">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">
                        Na Miastenia Gravis, o organismo acaba produzindo anticorpos que atacam justamente os receptores de acetilcolina, dificultando essa comunicação. Isso atrapalha a contração dos músculos e causa os principais sintomas da doença: fraqueza e cansaço.<sup>3,4</sup>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seta de conexão */}
                  <div className="flex justify-center">
                    <ArrowDown className="w-8 h-8 text-red-500" />
                  </div>

                  {/* Card 3 - Resultado: Sintomas */}
                  <div className="bg-gradient-to-r from-red-100 to-red-50 rounded-xl p-6 border-l-4 border-red-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-500 rounded-full p-3 flex-shrink-0">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">
                        Anticorpos são moléculas que o corpo fabrica para se defender de vírus e bactérias. Mas em doenças autoimunes, como a Miastenia Gravis, o sistema de defesa se confunde e passa a atacar partes saudáveis do próprio corpo — esses são os chamados autoanticorpos.<sup>3,5</sup>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Página do Quiz */}
            {currentPage === 'quiz' && (
              <div className="space-y-6">
                {!quizCompleted ? (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-purple-800 mb-2">
                        Teste seus Conhecimentos
                      </h3>
                      <div className="flex justify-center gap-2 mt-4">
                        {quizQuestions.map((_, index) => (
                          <div
                            key={index}
                            className={`w-10 h-2 rounded-full ${
                              index < currentQuestionIndex
                                ? 'bg-green-500'
                                : index === currentQuestionIndex
                                ? 'bg-purple-600'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-purple-800 mb-4">
                        Pergunta {currentQuestionIndex + 1} de {quizQuestions.length}
                      </h4>
                      <p className="text-lg text-gray-800 mb-6">
                        {quizQuestions[currentQuestionIndex].question}
                      </p>

                      <div className="space-y-3">
                        {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showResult}
                            className={`w-full text-left p-4 rounded-lg ${
                              showResult
                                ? index === quizQuestions[currentQuestionIndex].correct
                                  ? 'bg-green-100 border-2 border-green-500'
                                  : selectedAnswer === index
                                  ? 'bg-red-100 border-2 border-red-500'
                                  : 'bg-gray-100 opacity-50 border-2 border-transparent'
                                : 'bg-white hover:bg-purple-50 border-2 border-transparent hover:border-purple-300 transition-colors'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-800">{option}</span>
                              {showResult && (
                                index === quizQuestions[currentQuestionIndex].correct ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : selectedAnswer === index ? (
                                  <XCircle className="w-6 h-6 text-red-600" />
                                ) : null
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {showResult && (
                        <div className="mt-6">
                          <div className={`p-4 rounded-lg ${
                            selectedAnswer === quizQuestions[currentQuestionIndex].correct
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-blue-50 border border-blue-200'
                          }`}>
                            <p 
                              className="text-sm text-gray-700"
                              dangerouslySetInnerHTML={{ __html: quizQuestions[currentQuestionIndex].explanation }}
                            />
                          </div>
                          <button
                            onClick={handleNextQuestion}
                            className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                          >
                            {currentQuestionIndex < quizQuestions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-6">
                    <Award className="w-24 h-24 text-yellow-500 mx-auto" />
                    <h3 className="text-3xl font-bold text-purple-800">
                      Quiz Concluído!
                    </h3>
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8">
                      <p className="text-2xl font-bold text-purple-800 mb-2">
                        Você acertou {score} de {quizQuestions.length} perguntas!
                      </p>
                      <p className="text-lg text-gray-700 mb-6">
                        {score === quizQuestions.length
                          ? 'Parabéns! Você está bem informado sobre a Miastenia Gravis!'
                          : score >= quizQuestions.length * 0.6
                          ? 'Muito bem! Você tem um bom conhecimento sobre a Miastenia Gravis.'
                          : 'Continue aprendendo! O conhecimento é fundamental para o cuidado.'}
                      </p>
                      <button
                        onClick={resetQuiz}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Fazer Novamente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Página de Associações */}
            {currentPage === 'associations' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    Saiba como procurar apoio
                  </h3>
                  <p className="text-gray-600">
                    Conheça as associações que oferecem suporte aos pacientes e seus familiares:
                  </p>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {associations.map((association) => (
                     <div key={association.id} className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-all">
                       <div className="flex flex-col items-center mb-4">
                         {/* Logo da associação */}
                         <div className="w-40 h-28 bg-white rounded-lg flex items-center justify-center p-4 mb-3">
                           <img 
                             src={`/images/logo-${association.name === 'Casa Hunter' ? 'casahunter' : 
                                               association.name === 'AFAG Brasil' ? 'afag' : 
                                               association.name === 'ABRAMI' ? 'abrami' : 
                                               association.name === 'AMMI' ? 'AMMI' : 'casahunter'}.webp`}
                             alt={`Logo ${association.name}`}
                             className="max-w-full max-h-full object-contain"
                           />
                         </div>
                         
                         <div className="text-center">
                            <h4 className="text-xl font-bold text-purple-800 mb-1">
                              {association.name}
                            </h4>
                            {association.fullName && (
                              <p className="text-sm text-gray-600">
                                {association.fullName}
                              </p>
                            )}
                          </div>
                       </div>

                       <div className="space-y-3">
                         {/* Telefones */}
                         {association.phones.length > 0 && (
                           <div className="flex flex-col items-center gap-2">
                             <div className="flex items-center gap-2">
                               <Phone className="w-4 h-4 text-purple-600" />
                               <span className="text-sm text-gray-600 font-medium">Telefone</span>
                             </div>
                             <div className="flex flex-wrap justify-center gap-2">
                               {association.phones.map((phone, index) => (
                                 <span
                                   key={index}
                                   className="text-sm text-gray-700 font-medium"
                                 >
                                   {phone}
                                 </span>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Email */}
                         {association.email && (
                           <div className="flex flex-col items-center gap-2">
                             <div className="flex items-center gap-2">
                               <Mail className="w-4 h-4 text-purple-600" />
                               <span className="text-sm text-gray-600 font-medium">E-mail</span>
                             </div>
                             <span className="text-sm text-gray-700 font-medium text-center">
                               {association.email}
                             </span>
                           </div>
                         )}

                         {/* Instagram */}
                         {association.instagram && (
                           <div className="flex flex-col items-center gap-2">
                             <div className="flex items-center gap-2">
                               <Instagram className="w-4 h-4 text-purple-600" />
                               <span className="text-sm text-gray-600 font-medium">Instagram</span>
                             </div>
                             <span className="text-sm text-gray-700 font-medium">
                               @{association.instagram.split('/')[1]}
                             </span>
                           </div>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiasteniaGravisApp;