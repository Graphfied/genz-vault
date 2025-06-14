"use client"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, GamepadIcon, Trophy, Star, Zap, BookOpen } from "lucide-react"

const games = [
  {
    id: "money-quest",
    title: "Money Quest",
    description: "Interactive story about saving for a bike",
    icon: "🚴‍♂️",
    difficulty: "Easy",
    xp: 50,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "chore-master",
    title: "ChoreMaster",
    description: "Earn XP by completing real tasks",
    icon: "🧹",
    difficulty: "Easy",
    xp: 30,
    color: "from-green-400 to-green-600",
  },
  {
    id: "budget-battle",
    title: "Budget Battle",
    description: "AI-powered money decision quiz",
    icon: "⚔️",
    difficulty: "Medium",
    xp: 75,
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "halal-hustle",
    title: "Halal Hustle",
    description: "Learn halal vs haram money choices",
    icon: "📿",
    difficulty: "Easy",
    xp: 40,
    color: "from-mint-400 to-mint-600",
  },
  {
    id: "startup-tycoon",
    title: "Startup Tycoon Jr.",
    description: "Make business decisions and grow profits",
    icon: "💼",
    difficulty: "Hard",
    xp: 100,
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "savings-race",
    title: "Savings Race",
    description: "Weekly goal competition",
    icon: "🏁",
    difficulty: "Medium",
    xp: 60,
    color: "from-pink-400 to-pink-600",
  },
]

export default function GamesPage() {
  const { state } = useApp()
  const router = useRouter()
  const currentChild = state.children.find((child) => child.id === state.currentUser?.id)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/child")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold font-inter text-gray-800">Game Zone</h1>
            <p className="text-sm text-gray-600">Learn while you play!</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{currentChild?.avatar}</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Player Stats */}
        <Card className="glass border-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentChild?.name}</h3>
                  <p className="text-sm text-gray-600">Financial Explorer</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-xs text-gray-600">Total XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">0</p>
                    <p className="text-xs text-gray-600">Games Won</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Game */}
        <Card className="glass border-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">⭐</div>
              <div>
                <h3 className="text-xl font-bold">Featured: Budget Battle</h3>
                <p className="text-gray-600">AI-powered quiz to test your money skills!</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/child/games/budget-battle")}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Zap className="w-5 h-5 mr-2" />
              Play Now & Earn 75 XP!
            </Button>
          </CardContent>
        </Card>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game) => (
            <Card
              key={game.id}
              className="bg-white shadow-lg rounded-xl border-gray-100 hover:shadow-xl transition-transform duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center text-2xl`}
                    >
                      {game.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{game.title}</h3>
                      <p className="text-sm text-gray-600">{game.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                  <div className="flex items-center space-x-1 text-sm font-medium text-yellow-600">
                    <Star className="w-4 h-4" />
                    <span>{game.xp} XP</span>
                  </div>
                </div>

                <Button onClick={() => router.push(`/child/games/${game.id}`)} className="w-full" variant="outline">
                  <GamepadIcon className="w-4 h-4 mr-2" />
                  Play Game
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Tips */}
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Learning Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Start with Easy games</p>
                  <p className="text-sm text-blue-600">Build your confidence with simple money concepts</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-mint-50 rounded-lg">
                <div className="w-6 h-6 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-mint-800">Play daily</p>
                  <p className="text-sm text-mint-600">Regular practice helps you learn faster</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-purple-800">Ask questions</p>
                  <p className="text-sm text-purple-600">Talk to your parents about what you learn</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
