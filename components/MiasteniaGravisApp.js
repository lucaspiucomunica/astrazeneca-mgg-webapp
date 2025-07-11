'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, CheckCircle, XCircle, ChevronRight, Award, User, FileText, Headphones, Home, MessageCircle, Video, ExternalLink, ArrowLeft } from 'lucide-react';

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
  const [testimonialData, setTestimonialData] = useState({
    nome: '',
    idade: '',
    cidade: '',
    depoimento: ''
  });
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);

  // Refs para controlar os players de áudio e vídeo
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const heroVideoRef = useRef(null);

  // Função para controlar reprodução
  const togglePlayPause = () => {
    const currentMedia = testimonials[currentTestimonial].type === 'video' ? videoRef.current : audioRef.current;
    
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

  // Efeito para pausar reprodução ao sair da página
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
  }, [currentPage]);

  // Depoimentos fictícios com transcrições
  const testimonials = [
    {
      id: 1,
      name: "Maria Silva",
      age: 45,
      type: "audio",
      mediaUrl: "/audio/depoimento1.mp3",
      transcription: "Convivo com a Miastenia Gravis há 5 anos. No início foi difícil, mas com o tratamento adequado e apoio da família, hoje levo uma vida praticamente normal. O mais importante é não desistir e seguir as orientações médicas. Aprendi que cada dia é uma vitória e que somos mais fortes do que imaginamos."
    },
    {
      id: 2,
      name: "Rita",
      age: 38,
      type: "video",
      mediaUrl: "/video/teaser.mp4",
      transcription: "O diagnóstico precoce fez toda a diferença na minha vida. Hoje pratico exercícios leves, trabalho normalmente e cuido da minha família. A Miastenia Gravis não define quem eu sou. É parte da minha jornada, mas não é meu destino. Com o apoio médico certo, consegui retomar minhas atividades."
    },
    {
      id: 3,
      name: "Ana Costa",
      age: 52,
      type: "audio",
      mediaUrl: "/audio/depoimento3.mp3",
      transcription: "Aprendi a reconhecer meus limites e a importância do descanso. Com medicação adequada e acompanhamento regular, consigo manter minha qualidade de vida. Cada pequena vitória é uma grande conquista. Hoje valorizo mais os momentos simples e entendo que cuidar de mim é fundamental."
    }
  ];

  // Perguntas do Quiz
  const quizQuestions = [
    {
      question: "O que é a Miastenia Gravis?",
      options: [
        "Uma doença que afeta os ossos",
        "Uma doença autoimune que causa fraqueza muscular",
        "Uma infecção viral",
        "Uma doença hereditária do sangue"
      ],
      correct: 1,
      explanation: "A Miastenia Gravis é uma doença autoimune que afeta a comunicação entre nervos e músculos, causando fraqueza muscular."
    },
    {
      question: "Qual é um dos principais sintomas da Miastenia Gravis?",
      options: [
        "Febre alta constante",
        "Visão dupla e pálpebras caídas",
        "Dor nas articulações",
        "Perda de memória"
      ],
      correct: 1,
      explanation: "Problemas oculares como visão dupla (diplopia) e pálpebras caídas (ptose) são sintomas característicos da MG."
    },
    {
      question: "A Miastenia Gravis tem tratamento?",
      options: [
        "Não, é uma doença sem tratamento",
        "Sim, mas apenas com cirurgia",
        "Sim, com medicamentos e acompanhamento médico",
        "Apenas com fisioterapia"
      ],
      correct: 2,
      explanation: "A MG tem tratamento! Medicamentos, terapias e acompanhamento médico podem controlar os sintomas efetivamente."
    },
    {
      question: "Qual profissional é essencial no diagnóstico da MG?",
      options: [
        "Dermatologista",
        "Neurologista",
        "Cardiologista",
        "Ortopedista"
      ],
      correct: 1,
      explanation: "O neurologista é o especialista que diagnostica e trata a Miastenia Gravis."
    },
    {
      question: "Pessoas com MG podem levar uma vida normal?",
      options: [
        "Não, ficam sempre acamadas",
        "Sim, com tratamento adequado",
        "Apenas algumas pessoas",
        "Somente com transplante"
      ],
      correct: 1,
      explanation: "Com tratamento adequado e acompanhamento médico, a maioria das pessoas com MG pode levar uma vida produtiva e satisfatória!"
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
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleTestimonialSubmit = () => {
    if (!testimonialData.nome || !testimonialData.idade || !testimonialData.depoimento) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setTestimonialSubmitted(true);
    console.log('Depoimento enviado:', testimonialData);
  };

  const handleTestimonialChange = (field, value) => {
    setTestimonialData({
      ...testimonialData,
      [field]: value
    });
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Componente do Footer
  const Footer = () => (
    <div className="mt-8 border-t pt-6">
      <div className="flex flex-col items-center justify-center">
        <a 
          href="https://materiais.programafazbem.com.br/miastenia-gravis" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
        >
          <ExternalLink className="w-5 h-5" />
          Acesse o site da campanha e saiba mais
        </a>
        
        <div className="mt-6 inline-block p-4 bg-white rounded-lg shadow-lg">
          <img 
            src="/images/qr-code.png" 
            alt="QR Code para acessar o site" 
            className="w-48 h-48 mx-auto"
          />
          <p className="text-sm text-gray-600 mt-2">
            Tire uma foto para acessar em casa
          </p>
        </div>
      </div>
      <p className="text-center text-gray-600 text-sm mt-4">
        © 2025 - Campanha de Conscientização sobre Miastenia Gravis
      </p>
    </div>
  );

  // Página Principal
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header da Campanha */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-purple-800 mb-4">
                A tempestade vai e a vida volta
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Conhecimento, Apoio e Esperança
              </p>
              <p className="text-lg text-gray-500">
                Uma campanha de conscientização sobre Miastenia Gravis
              </p>
            </div>

            {/* Vídeo Hero */}
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg aspect-video relative">
              {!isHeroVideoPlaying ? (
                <div 
                  className="group cursor-pointer w-full h-full"
                  onClick={playHeroVideo}
                >
                  <img 
                    src="/images/thumb-video.png" 
                    alt="A tempestade vai e a vida volta - Ilustração de mulher navegando" 
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
                  src="/video/teaser.mp4"
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setIsHeroVideoPlaying(false)}
                />
              )}
            </div>

            {/* Botões de Navegação estilo iOS */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => navigateTo('testimonials')}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              >
                <Headphones className="w-12 h-12" />
                <span className="font-semibold text-sm">Conheça as histórias</span>
              </button>

              <button
                onClick={() => navigateTo('quiz')}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              >
                <Award className="w-12 h-12" />
                <span className="font-semibold text-sm">Teste seus conhecimentos</span>
              </button>

              <button
                onClick={() => navigateTo('share')}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              >
                <MessageCircle className="w-12 h-12" />
                <span className="font-semibold text-sm">Deixe seu Depoimento</span>
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Header com botão voltar */}
          <div className="p-6 border-b flex items-center justify-between">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h2 className="text-2xl font-bold text-purple-800">
              {currentPage === 'testimonials' && 'Depoimentos'}
              {currentPage === 'quiz' && 'Quiz Educativo'}
              {currentPage === 'share' && 'Compartilhe sua História'}
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
                    Histórias de Superação
                  </h3>
                  <p className="text-gray-600">
                    Ouça e assista depoimentos de pessoas que convivem com a MG
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {testimonials[currentTestimonial].name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-purple-800">
                          {testimonials[currentTestimonial].name}
                        </h4>
                        <p className="text-gray-600 flex items-center gap-2">
                          {testimonials[currentTestimonial].age} anos
                          {testimonials[currentTestimonial].type === 'video' ? 
                            <Video className="w-4 h-4" /> : 
                            <Volume2 className="w-4 h-4" />
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={togglePlayPause}
                      className="bg-purple-600 text-white p-4 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                  </div>

                  {/* Área do player de vídeo/áudio */}
                  {testimonials[currentTestimonial].type === 'video' ? (
                    <div className="mb-4 rounded-lg overflow-hidden aspect-video">
                      <video
                        ref={videoRef}
                        src={testimonials[currentTestimonial].mediaUrl}
                        className="w-full h-full object-cover"
                        controls
                        onEnded={handleMediaEnded}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </div>
                  ) : (
                    <div className="mb-4 bg-white bg-opacity-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Volume2 className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-gray-700 font-medium">Depoimento em Áudio</span>
                      </div>
                      <audio
                        ref={audioRef}
                        src={testimonials[currentTestimonial].mediaUrl}
                        className="w-full"
                        controls
                        onEnded={handleMediaEnded}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </div>
                  )}

                  {/* Botão de transcrição */}
                  <button
                    onClick={() => setShowTranscription(!showTranscription)}
                    className="mb-4 text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    {showTranscription ? 'Ocultar' : 'Mostrar'} Transcrição
                  </button>

                  {/* Transcrição */}
                  {showTranscription && (
                    <div className="bg-white bg-opacity-70 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Transcrição:</h5>
                      <p className="text-gray-700 leading-relaxed">
                        &quot;{testimonials[currentTestimonial].transcription}&quot;
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => changeTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentTestimonial === index
                            ? 'bg-purple-600 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                  <Headphones className="w-6 h-6 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Use os fones de ouvido para uma melhor experiência
                  </p>
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
                            className={`w-full text-left p-4 rounded-lg transition-all ${
                              showResult
                                ? index === quizQuestions[currentQuestionIndex].correct
                                  ? 'bg-green-100 border-2 border-green-500'
                                  : selectedAnswer === index
                                  ? 'bg-red-100 border-2 border-red-500'
                                  : 'bg-gray-100 opacity-50'
                                : 'bg-white hover:bg-purple-50 border-2 border-transparent hover:border-purple-300'
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
                            <p className="text-sm text-gray-700">
                              {quizQuestions[currentQuestionIndex].explanation}
                            </p>
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
                          ? 'Muito bem! Você tem um bom conhecimento sobre a MG.'
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

            {/* Página de Deixar Depoimento */}
            {currentPage === 'share' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    Compartilhe sua História
                  </h3>
                  <p className="text-gray-600">
                    Seu depoimento pode inspirar outras pessoas
                  </p>
                </div>

                {!testimonialSubmitted ? (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          value={testimonialData.nome}
                          onChange={(e) => handleTestimonialChange('nome', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 placeholder-gray-500"
                          placeholder="Seu nome"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Idade *
                        </label>
                        <input
                          type="number"
                          value={testimonialData.idade}
                          onChange={(e) => handleTestimonialChange('idade', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 placeholder-gray-500"
                          placeholder="Sua idade"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Cidade/Estado
                      </label>
                      <input
                        type="text"
                        value={testimonialData.cidade}
                        onChange={(e) => handleTestimonialChange('cidade', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 placeholder-gray-500"
                        placeholder="São Paulo/SP"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Seu Depoimento *
                      </label>
                      <textarea
                        value={testimonialData.depoimento}
                        onChange={(e) => handleTestimonialChange('depoimento', e.target.value)}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 placeholder-gray-500"
                        placeholder="Conte sua experiência com a Miastenia Gravis. Como foi o diagnóstico? Como é seu dia a dia? Que mensagem você gostaria de deixar para outras pessoas?"
                      />
                    </div>



                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        * Campos obrigatórios. Seu depoimento passará por uma revisão antes de ser publicado.
                      </p>
                    </div>

                    <button
                      onClick={handleTestimonialSubmit}
                      className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
                    >
                      Enviar Depoimento
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-6 py-12">
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-green-700">
                      Depoimento Enviado com Sucesso!
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Obrigado por compartilhar sua história. Sua experiência pode inspirar outras pessoas que vivem com Miastenia Gravis.
                    </p>
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setTestimonialSubmitted(false);
                          setTestimonialData({
                            nome: '',
                            idade: '',
                            cidade: '',
                            depoimento: ''
                          });
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Enviar Outro Depoimento
                      </button>
                    </div>
                  </div>
                )}
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