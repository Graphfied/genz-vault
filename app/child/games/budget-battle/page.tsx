"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Zap, Trophy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateAIResponse } from "@/lib/gemini"

interface Question {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export default function BudgetBattle() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)

  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const currentChild = state.children.find((child) => child.id === state.currentUser?.id)

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = async () => {
    setIsLoading(true)
    try {
      const prompt = `Generate 5 financial literacy quiz questions for Pakistani kids aged 8-18. Each question should be culturally relevant to Pakistan, use Pakistani Rupees (Rs.), and include local context. Format as JSON array with this structure:
      [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": 0,
          "explanation": "Why this answer is correct"
        }
      ]
      
      Topics to cover: saving money, spending wisely, halal earning, budgeting, Pakistani currency. Make questions engaging and age-appropriate. Use simple English with some Urdu words where natural.`

      const response = await generateAIResponse(prompt)

      // Try to parse JSON from response
      let parsedQuestions: Question[] = []
      try {
        // Extract JSON from response if it's wrapped in text
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          parsedQuestions = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No JSON found")
        }
      } catch (parseError) {
        // Fallback questions if AI response parsing fails
        parsedQuestions = [
          {
            question: "You have Rs. 500. Your friend wants to buy expensive snacks for Rs. 300. What should you do?",
            options: [
              "Buy the snacks to make friend happy",
              "Save the money for something important",
              "Spend all money on games",
              "Give money to friend",
            ],
            correct: 1,
            explanation: "Saving money for important things is always better than spending on unnecessary items!",
          },
          {
            question: "Which is a halal way to earn money?",
            options: ["Selling haram food", "Helping neighbors with work", "Cheating in business", "Gambling"],
            correct: 1,
            explanation: "Helping others with honest work is a halal and blessed way to earn money!",
          },
          {
            question: "You want to buy a cricket bat for Rs. 2000. You have Rs. 500. What's the best plan?",
            options: [
              "Borrow money from friends",
              "Save Rs. 100 every month for 15 months",
              "Ask parents to buy immediately",
              "Buy a cheaper broken bat",
            ],
            correct: 1,
            explanation: "Saving regularly helps you reach your goals without debt or asking others!",
          },
          {
            question: "Your Eidi money is Rs. 1000. What's the smartest choice?",
            options: [
              "Spend all on toys immediately",
              "Save 70% and spend 30% on fun",
              "Give all to friends",
              "Hide it and forget about it",
            ],
            correct: 1,
            explanation: "The 70-30 rule helps you enjoy some money now while saving for the future!",
          },
          {
            question: "Which expense is most important for a family?",
            options: ["Latest mobile phone", "Food and shelter", "Expensive clothes", "Video games"],
            correct: 1,
            explanation: "Basic needs like food and shelter should always come first in any budget!",
          },
        ]
      }

      setQuestions(parsedQuestions)
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Loading Error",
        description: "Using offline questions for now",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correct
    if (isCorrect) {
      setScore(score + 1)
    }

    setShowResult(true)
    setShowExplanation(true)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowExplanation(false)
      } else {
        setGameComplete(true)
        // Award XP and money
        if (currentChild) {
          const xpEarned = score * 15 + 25 // Base 25 XP + 15 per correct answer
          const moneyEarned = score * 10 + 20 // Base 20 Rs + 10 per correct answer

          const updatedChild = {
            ...currentChild,
            balance: currentChild.balance + moneyEarned,
          }
          dispatch({ type: "UPDATE_CHILD", payload: updatedChild })

          toast({
            title: "Game Complete! 🎉",
            description: `You earned Rs. ${moneyEarned} and ${xpEarned} XP!`,
          })
        }
      }
    }, 3000)
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setGameComplete(false)
    setShowExplanation(false)
    generateQuestions()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="glass border-0 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading Budget Battle...</p>
          <p className="text-sm text-gray-600">AI is preparing your questions!</p>
        </Card>
      </div>
    )
  }

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    let performance = "Good try!"
    let emoji = "👍"

    if (percentage >= 80) {
      performance = "Excellent!"
      emoji = "🏆"
    } else if (percentage >= 60) {
      performance = "Great job!"
      emoji = "⭐"
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="glass border-0 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="text-2xl font-bold mb-2">{performance}</h2>
            <p className="text-lg mb-4">
              You scored {score} out of {questions.length}
            </p>
            <div className="text-4xl font-bold text-purple-600 mb-2">{percentage}%</div>

            <div className="space-y-4 mt-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-800">Rewards Earned:</p>
                <p className="text-green-600">💰 Rs. {score * 10 + 20}</p>
                <p className="text-green-600">⭐ {score * 15 + 25} XP</p>
              </div>

              <div className="flex space-x-3">
                <Button onClick={restartGame} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button onClick={() => router.push("/child/games")} variant="outline" className="flex-1">
                  More Games
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/child/games")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold font-inter text-gray-800">Budget Battle</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Progress */}
        <Card className="glass border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-500" />
              Question {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium mb-6">{currentQ?.question}</p>

            <div className="space-y-3">
              {currentQ?.options.map((option, index) => {
                let buttonClass =
                  "w-full p-4 text-left border-2 rounded-md transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"

                if (showResult) {
                  if (index === currentQ.correct) {
                    buttonClass += " border-green-500 bg-green-50 text-green-800"
                  } else if (index === selectedAnswer && index !== currentQ.correct) {
                    buttonClass += " border-red-500 bg-red-50 text-red-800"
                  } else {
                    buttonClass += " border-gray-200 bg-gray-50 text-gray-600"
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += " border-purple-500 bg-purple-50 text-purple-800"
                  } else {
                    buttonClass += " border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 font-bold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      {option}
                    </div>
                  </button>
                )
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="font-semibold text-blue-800 mb-2">Explanation:</p>
                <p className="text-blue-700">{currentQ?.explanation}</p>
              </div>
            )}

            {!showResult && (
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="w-full mt-6 h-12 text-lg font-semibold"
              >
                {currentQuestion === questions.length - 1 ? "Finish Game" : "Next Question"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
