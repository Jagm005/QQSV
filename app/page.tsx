"use client"


import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Phone, Users, Zap, Trophy, Volume2, Eye } from "lucide-react"

import equipo1Questions from "./questions/equipo1"
import equipo2Questions from "./questions/equipo2"
import equipo3Questions from "./questions/equipo3"
import equipo4Questions from "./questions/equipo4"
import equipo5Questions from "./questions/equipo5"
import equipo6Questions from "./questions/equipo6"
import desempateQuestions from "./questions/desempate"
import Image from "next/image"

// Tiempo total del juego en segundos (13 minutos por defecto)
 const showDesempate = false // <-- CAMBIA A true PARA MOSTRAR PREGUNTAS DE DESEMPATE
// Cambia este valor para modificar la duración total del juego
const TOTAL_GAME_TIME = 13 * 60 // <-- aquí cambias el tiempo total del juego

// Duración del temporizador para comodines (en segundos)
// Cambia este valor para modificar cuánto dura el comodín de llamada/público
const LIFELINE_TIMER_DURATION = 30 // <-- aquí cambias el tiempo de los comodines

// Añadir equipo de desempate
const TEAMS = [
  { id: 1, name: "Equipo 1", color: "bg-gradient-to-r from-blue-600 to-blue-400", textColor: "text-blue-300" },
  { id: 2, name: "Equipo 2", color: "bg-gradient-to-r from-green-600 to-green-400", textColor: "text-green-300" },
  { id: 3, name: "Equipo 3", color: "bg-gradient-to-r from-red-600 to-red-400", textColor: "text-red-300" },
  { id: 4, name: "Equipo 4", color: "bg-gradient-to-r from-yellow-600 to-yellow-400", textColor: "text-yellow-300" },
  { id: 5, name: "Equipo 5", color: "bg-gradient-to-r from-pink-600 to-pink-400", textColor: "text-pink-300" },
  { id: 6, name: "Equipo 6", color: "bg-gradient-to-r from-teal-600 to-teal-400", textColor: "text-teal-300" },
 // { id: 7, name: "Desempate", color: "bg-gradient-to-r from-purple-600 to-purple-400", textColor: "text-purple-300" }, // Nuevo equipo
]

const teamQuestions = {
  1: equipo1Questions,
  2: equipo2Questions,
  3: equipo3Questions,
  4: equipo4Questions,
  5: equipo5Questions,
  6: equipo6Questions,
  7: desempateQuestions, // Asocia preguntas de desempate
}

type GameState = "team-selection" | "playing" | "finished"
type LifelineType = "fifty-fifty" | "relevo" | "consultar-equipo" | "saltar"

interface Lifelines {
  "fifty-fifty": boolean
  "relevo": boolean
  "consultar-equipo": boolean
  "saltar": boolean
}

// Componente para mostrar el temporizador circular de los comodines

const CircularTimer = ({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) => {
  const progress = (timeLeft / totalTime) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-600"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-amber-400 transition-all duration-1000 ease-linear"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-white">{timeLeft}</span>
      </div>
    </div>
  )
}

// Componente principal del juego
export default function VisionarioGame() {
  // Estado para mostrar el diálogo de imagen ampliada
  const [showImageDialog, setShowImageDialog] = useState<null | string>(null)
  // Estado del juego: selección de equipo, jugando o terminado
  const [gameState, setGameState] = useState<GameState>("team-selection")
  // Equipo seleccionado
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  // Pregunta actual
  const [currentQuestion, setCurrentQuestion] = useState(0)
  // Puntuación actual
  const [score, setScore] = useState(0)
  // Tiempo restante del juego
  const [timeLeft, setTimeLeft] = useState(TOTAL_GAME_TIME) // <-- aquí se inicializa el tiempo total
  // Tiempo restante para el comodín activo
  const [lifelineTimeLeft, setLifelineTimeLeft] = useState(LIFELINE_TIMER_DURATION) // <-- aquí se inicializa el tiempo de comodín
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lifelines, setLifelines] = useState<Lifelines>({
    "fifty-fifty": true,
    "relevo": true,
    "consultar-equipo": true,
    "saltar": true,
  })
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([])
  const [showLifelineDialog, setShowLifelineDialog] = useState<LifelineType | null>(null)
  const [audienceResults, setAudienceResults] = useState<number[]>([])
  const [friendSuggestion, setFriendSuggestion] = useState<string>("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  // Cambia esta línea a true para activar las preguntas de desempate
 

  // Importar preguntas de desempate
  // @ts-ignore
  const desempateQuestions = require("./questions/desempate").default || require("./questions/desempate").desempateQuestions || [];

  type Question = { question: string; options: string[]; correct: number; image?: string };
  const currentQuestions: Question[] = selectedTeam ? teamQuestions[selectedTeam as keyof typeof teamQuestions] : []
  // Elimina el uso de showDesempate aquí, solo usa currentQuestions
  const questionsToShow: Question[] = currentQuestions
  const currentTeamInfo = selectedTeam ? TEAMS.find((t) => t.id === selectedTeam) : null

  // Función para activar comodines
  const activateLifeline = (type: LifelineType) => {
    if (!lifelines[type]) return

    setLifelines({ ...lifelines, [type]: false })

    switch (type) {
      case "fifty-fifty": {
        const correctAnswer = currentQuestions[currentQuestion].correct
        const incorrectOptions = [0, 1, 2, 3].filter((i) => i !== correctAnswer)
        const toHide = incorrectOptions.slice(0, 2)
        setHiddenOptions(toHide)
        break
      }
      case "relevo": {
        setShowLifelineDialog("relevo")
        break
      }
      case "consultar-equipo": {
        setShowLifelineDialog("consultar-equipo")
        setLifelineTimeLeft(60) // 1 minuto
        break
      }
      case "saltar": {
        setLifelines({ ...lifelines, saltar: false })
        nextQuestion()
        break
      }
    }
  }

  // Efecto para manejar el temporizador de los comodines
  // Cierra el diálogo de relevo automáticamente después de 2 segundos
  useEffect(() => {
    if (showLifelineDialog === "relevo") {
      const timer = setTimeout(() => setShowLifelineDialog(null), 10000)
      return () => clearTimeout(timer)
    }
  }, [showLifelineDialog])
  useEffect(() => {
    if ((showLifelineDialog === "consultar-equipo") && lifelineTimeLeft > 0) {
      const timer = setTimeout(() => setLifelineTimeLeft(lifelineTimeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (lifelineTimeLeft === 0 && showLifelineDialog === "consultar-equipo") {
      setShowLifelineDialog(null)
      setLifelineTimeLeft(60)
    }
  }, [lifelineTimeLeft, showLifelineDialog])

  // Efecto para manejar el temporizador principal del juego
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame()
    }
  }, [timeLeft, gameState, showFeedback])

  const playSound = useCallback(
    (type: "correct" | "wrong" | "background") => {
      if (!soundEnabled) return
      console.log(`Playing ${type} sound`)
    },
    [soundEnabled],
  )

  const startGame = (teamId?: number) => {
    if (teamId) {
      setSelectedTeam(teamId)
    }
    setGameState("playing")
    setCurrentQuestion(0)
    setScore(0)
    setTimeLeft(TOTAL_GAME_TIME)
    setSelectedAnswer(null)
    setShowFeedback(false)
  setLifelines({ "fifty-fifty": true, "relevo": true, "consultar-equipo": true, "saltar": true })
    setHiddenOptions([])
    playSound("background")
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback || hiddenOptions.includes(answerIndex)) return

    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const isCorrect = answerIndex === currentQuestions[currentQuestion].correct

    if (isCorrect) {
      const points = currentQuestion < 5 ? 5 : 10
      setScore(score + points)
      playSound("correct")
    } else {
      playSound("wrong")
    }

    setTimeout(() => {
      if (currentQuestion < currentQuestions.length - 1) {
        nextQuestion()
      } else {
        endGame()
      }
    }, 2000)
  }

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setHiddenOptions([])
  }

  const endGame = () => {
    setGameState("finished")
  }



  const getButtonStyle = (index: number) => {
    if (hiddenOptions.includes(index)) return "opacity-30 cursor-not-allowed"
    if (!showFeedback) return "hover:bg-amber-600 hover:scale-105 transition-all duration-200"
    if (selectedAnswer === index) {
      return index === currentQuestions[currentQuestion].correct ? "bg-green-600 text-white" : "bg-red-600 text-white"
    }
    if (index === currentQuestions[currentQuestion].correct && showFeedback) {
      return "bg-green-600 text-white"
    }
    return ""
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Renderizado para selección de equipo
  if (gameState === "team-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl w-full select-none"
        >
          <motion.div
            animate={{
              textShadow: ["0 0 20px #f59e0b", "0 0 40px #f59e0b", "0 0 20px #f59e0b"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="mb-8 select-none"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 select-none">¿Quién Quiere Ser</h1>
            <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-8 select-none">Visionario?</h1>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8 select-none"
          >
            <h2 className="text-2xl text-white mb-2 select-none">Selecciona el Equipo Participante</h2>
            <p className="text-lg text-amber-400 mb-6 select-none">
              13 minutos • 20 preguntas
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none">
              {TEAMS.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="relative select-none"
                >
                  <Button
                    onClick={() => startGame(team.id)}
                    size="lg"
                    className={`w-full py-4 px-0 ${team.color} hover:opacity-80 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] select-none`}
                  >
                    <div className="flex flex-col items-center w-full select-none">
                      <div className={`w-16 h-16 rounded-full ${
                        team.id === 1 ? "bg-blue-900"
                        : team.id === 2 ? "bg-green-900"
                        : team.id === 3 ? "bg-red-900"
                        : team.id === 4 ? "bg-yellow-900"
                        : team.id === 5 ? "bg-pink-900"
                        : team.id === 6 ? "bg-teal-900"
                        : team.id === 7 ? "bg-purple-900"
                        : "bg-gray-900"
                      } mb-2 flex items-center justify-center select-none`}>
                        <span className="text-2xl font-bold text-white select-none">{team.id}</span>
                      </div>
                      <span className="text-base font-bold text-white text-center break-words w-full select-none" style={{wordBreak: 'break-word', lineHeight: '1.1'}}>{team.name}</span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
            {/* Cuadro azul para preguntas de desempate */}
            {showDesempate && (
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg px-8 py-6 transition-all duration-300"
                  onClick={() => {
                    setGameState("playing");
                    setCurrentQuestion(0);
                    setScore(0);
                    setTimeLeft(TOTAL_GAME_TIME);
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                    setLifelines({ "fifty-fifty": true, "relevo": true, "consultar-equipo": true, "saltar": true });
                    setHiddenOptions([]);
                    setSelectedTeam(null); // Para que no muestre equipo
                  }}
                >
                  <span className="text-white text-xl font-bold">Preguntas de desempate</span>
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Renderizado para pantalla de juego terminado
  if (gameState === "finished") {
    const timeUsed = TOTAL_GAME_TIME - timeLeft
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center select-none"
        >
          <Trophy className="h-24 w-24 text-amber-400 mx-auto mb-6 select-none" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 select-none">¡Juego Terminado!</h1>
          {currentTeamInfo && (
            <div className={`text-2xl ${currentTeamInfo.textColor} mb-4 font-bold select-none`}>Equipo: {currentTeamInfo.name}</div>
          )}
          <div className="text-2xl text-amber-400 mb-4 select-none">Bibliocoins: {score}</div>
          <div className="text-xl text-white mb-4 select-none">Tiempo restante: {formatTime(timeLeft)}</div>
          <div className="text-lg text-white mb-4 select-none">
            Contador de tiempo: {formatTime(timeUsed)}
          </div>
          <div className="space-y-4 select-none">
            
            <Button
              onClick={() => setGameState("team-selection")}
              size="lg"
              variant="outline"
              className="text-black border-amber-400 hover:bg-amber-400 hover:text-black font-bold text-xl px-8 py-4 rounded-full select-none"
            >
              <span className="text-black select-none">Cambiar Equipo</span>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Renderizado principal del juego
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 select-none">
      <div className="max-w-4xl mx-auto select-none">
        {/* Header con nombre de equipo, número de pregunta, puntuación y temporizador */}
        <div className="flex justify-between items-center mb-6 select-none">
          <div className="text-white select-none">
            {currentTeamInfo && (
              <div className={`text-lg font-bold ${currentTeamInfo.textColor} mb-1 select-none`}>{currentTeamInfo.name}</div>
            )}
            <div className="text-sm opacity-75 select-none">
              Pregunta {currentQuestion + 1} de {questionsToShow.length}
            </div>
            <div className="text-lg font-bold text-amber-400 select-none">{score} Bibliocoins</div>
          </div>
          <div className="flex items-center gap-4 select-none">
            <div className="flex items-center text-white select-none">
              <Clock className="h-5 w-5 mr-2 select-none" />
              <span className={`text-xl font-bold ${timeLeft <= 60 ? "text-red-400" : ""} select-none`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Progress
              value={(timeLeft / TOTAL_GAME_TIME) * 100}
              className="w-24 [&>div]:!bg-white select-none"
            />
          </div>
        </div>
        {/* Lifelines */}
        <div className="flex justify-center gap-4 mb-8 select-none">
          <Button
            variant="outline"
            size="sm"
            onClick={() => activateLifeline("fifty-fifty")}
            disabled={!lifelines["fifty-fifty"]}
            className={`${lifelines["fifty-fifty"] ? "text-black border-amber-400 bg-amber-400 hover:bg-amber-500 select-none" : "opacity-50 text-gray-400 border-gray-400 select-none"}`}
          >
            <Zap className="h-4 w-4 mr-2 select-none" />
            <span className="select-none">50/50</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => activateLifeline("relevo")}
            disabled={!lifelines["relevo"]}
            className={`${lifelines["relevo"] ? "text-black border-blue-400 bg-blue-400 hover:bg-blue-500 select-none" : "opacity-50 text-gray-400 border-gray-400 select-none"}`}
          >
            <Users className="h-4 w-4 mr-2 select-none" />
            <span className="select-none">Relevo</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => activateLifeline("consultar-equipo")}
            disabled={!lifelines["consultar-equipo"]}
            className={`${lifelines["consultar-equipo"] ? "text-black border-green-400 bg-green-400 hover:bg-green-500 select-none" : "opacity-50 text-gray-400 border-gray-400 select-none"}`}
          >
            <Users className="h-4 w-4 mr-2 select-none" />
            <span className="select-none">Consultar con tu equipo</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => activateLifeline("saltar")}
            disabled={!lifelines["saltar"]}
            className={`${lifelines["saltar"] ? "text-black border-gray-400 bg-gray-400 hover:bg-gray-500 select-none" : "opacity-50 text-gray-400 border-gray-400 select-none"}`}
          >
            <Eye className="h-4 w-4 mr-2 select-none" />
            <span className="select-none">Saltar pregunta</span>
          </Button>
        </div>
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800/50 border-amber-600 mb-8 select-none">
              <CardContent className="p-8 select-none">
                {questionsToShow[currentQuestion]?.image && (
                  <div className="flex justify-center mb-4 select-none">
                    <button
                      type="button"
                      onClick={() => setShowImageDialog(questionsToShow[currentQuestion].image!)}
                      className="focus:outline-none select-none"
                      aria-label="Ampliar imagen"
                    >
                      <Image
                        src={questionsToShow[currentQuestion].image}
                        alt="Imagen de la pregunta"
                        width={200}
                        height={120}
                        className="rounded shadow max-h-32 max-w-[200px] object-contain hover:scale-105 transition-transform duration-200 cursor-zoom-in select-none"
                      />
                    </button>
                  </div>
                )}
        {/* Dialogo para imagen ampliada */}
        <Dialog open={!!showImageDialog} onOpenChange={() => setShowImageDialog(null)}>
  <DialogContent className="bg-black border-amber-600 max-w-3xl flex flex-col items-center justify-center select-none" >
            <DialogHeader>
              <DialogTitle className="text-white text-center select-none">Imagen ampliada</DialogTitle>
            </DialogHeader>
            {showImageDialog && (
              <div className="flex justify-center items-center w-full select-none">
                <Image
                  src={showImageDialog}
                  alt="Imagen ampliada"
                  width={700}
                  height={440}
                  className="rounded shadow object-contain max-h-[70vh] max-w-full select-none"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
                <h2 className="text-xl md:text-2xl font-bold text-white text-center select-none">
                  {questionsToShow[currentQuestion]?.question}
                </h2>
                <div className="text-center mt-4 select-none">
                  <Badge variant="secondary" className="bg-amber-500 text-black font-bold select-none">
                    {currentQuestion < 5 ? "5" : "10"} Bibliocoins
                  </Badge>
                </div>
              </CardContent>
            </Card>
            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
              {questionsToShow[currentQuestion]?.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback || hiddenOptions.includes(index)}
                    className={`w-full p-6 text-left justify-start text-white border-amber-400 bg-gray-800/30 ${getButtonStyle(index)} select-none`}
                  >
                    <Badge variant="secondary" className="mr-4 bg-amber-500 text-black select-none">
                      {String.fromCharCode(65 + index)}
                    </Badge>
                    <span className="select-none">{option}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Dialogo de Relevo */}
        <Dialog open={showLifelineDialog === "relevo"} onOpenChange={() => setShowLifelineDialog(null)}>
  <DialogContent className="bg-blue-900 border-blue-400 select-none" >
            <DialogHeader>
              <DialogTitle className="text-white flex items-center justify-center select-none">
                <Users className="h-5 w-5 mr-2 select-none animate-bounce" />
                <span className="select-none">¡Relevo activado!</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-8 select-none">
              <div className="w-32 h-32 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center animate-pulse">
                  <span className="text-3xl font-bold text-white">🏃‍♂️🏃‍♂️</span>
                </div>
              </div>
              <p className="text-white mt-4 text-center select-none">¡Otros Jugadores toman el relevo!</p>
            </div>
          </DialogContent>
        </Dialog>
        {/* Dialogo de Consultar con tu equipo */}
        <Dialog open={showLifelineDialog === "consultar-equipo"} onOpenChange={() => setShowLifelineDialog(null)}>
  <DialogContent className="bg-green-900 border-green-400 select-none" >
            <DialogHeader>
              <DialogTitle className="text-white flex items-center justify-center select-none">
                <Users className="h-5 w-5 mr-2 select-none" />
                <span className="select-none">Consultar con tu equipo</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-8 select-none">
              <CircularTimer timeLeft={lifelineTimeLeft} totalTime={60} />
              <p className="text-white mt-4 text-center select-none">Tienen 1 minuto para deliberar la respuesta.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

