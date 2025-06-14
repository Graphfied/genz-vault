"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  CheckCircle,
  GamepadIcon,
  CreditCard,
  LogOut,
  Sparkles,
  Trophy,
  Star,
  ShoppingBag,
  Wallet,
  MessageCircle,
  XIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateAIResponse } from "@/lib/gemini"
import { Input } from "@/components/ui/input"
import { AiChatbot } from "@/components/ai-chatbot" // Adjust path if needed

export default function ChildDashboard() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [aiMessage, setAiMessage] = useState("")
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [showChatbot, setShowChatbot] = useState(false)

  const currentChild = state.children.find((child) => child.id === state.currentUser?.id)
  const childTasks = state.tasks.filter((task) => task.childId === state.currentUser?.id)
  const completedTasks = childTasks.filter((task) => task.completed)
  const pendingTasks = childTasks.filter((task) => !task.completed)

  useEffect(() => {
    if (currentChild) {
      generateWelcomeMessage()
    }
  }, [currentChild])

  const generateWelcomeMessage = async () => {
    if (!currentChild) return

    setIsLoadingAI(true)
    try {
      const prompt = `You are a friendly AI money buddy for Pakistani kids. Welcome ${currentChild.name} (age ${currentChild.age}) to their financial dashboard. They have Rs. ${currentChild.balance} balance and ${completedTasks.length} completed tasks. Give them a warm, encouraging message in simple English with some Urdu words mixed in. Keep it under 50 words and include relevant emojis. Be culturally appropriate for Pakistan.`

      const response = await generateAIResponse(prompt)
      setAiMessage(response)
    } catch (error) {
      setAiMessage(
        `Assalam-o-Alaikum ${currentChild.name}! 🌟 Welcome to your KidsBank dashboard! You're doing great with Rs. ${currentChild.balance} saved. Ready to learn and earn more? Let's go! 💪`,
      )
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleLogout = () => {
    dispatch({ type: "SET_USER", payload: null })
    router.push("/")
  }

  const completeTask = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (task && currentChild) {
      dispatch({ type: "COMPLETE_TASK", payload: taskId })

      // Update child balance
      const updatedChild = {
        ...currentChild,
        balance: currentChild.balance + task.reward,
      }
      dispatch({ type: "UPDATE_CHILD", payload: updatedChild })

      toast({
        title: "Task Completed! 🎉",
        description: `You earned Rs. ${task.reward}! Great job!`,
      })
    }
  }

  const handleDepositToMainWallet = () => {
    const amount = Number.parseFloat(depositAmount)
    if (currentChild && amount > 0) {
      if (currentChild.internalWalletBalance >= amount) {
        dispatch({ type: "DEPOSIT_TO_MAIN_WALLET", payload: { childId: currentChild.id, amount } })
        toast({ title: "Success!", description: `Rs. ${amount} moved to your main wallet.` })
        setDepositAmount("")
      } else {
        toast({
          title: "Oops!",
          description: "Not enough money in your pocket money (internal wallet).",
          variant: "destructive",
        })
      }
    } else {
      toast({ title: "Hmm!", description: "Please enter a valid amount.", variant: "destructive" })
    }
  }

  if (!currentChild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Child account not found</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{currentChild.avatar}</div>
            <div>
              <h1 className="text-xl font-bold font-inter text-brand-navy">Hi {currentChild.name}!</h1>
              <p className="text-sm text-gray-600">Ready to learn & earn?</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* AI Welcome Message */}
        <Card className="bg-orange-50 border-l-4 border-brand-orange">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-800 mb-1">Your Money Buddy says:</p>
                {isLoadingAI ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <p className="text-gray-700">{aiMessage}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card className={`${currentChild.cardDesign.background} text-white shadow-2xl`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">KidsBank</p>
                <p className="text-xl font-bold">{currentChild.name}</p>
              </div>
              <div className="text-4xl">{currentChild.avatar}</div>
            </div>
            <div>
              <p className="text-sm opacity-90">Your Balance</p>
              <p className="text-3xl font-bold">Rs. {currentChild.balance}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Age {currentChild.age}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/child/customize-card")}
                className="text-white hover:bg-white/20"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Customize
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg rounded-xl border-gray-100 text-center">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-brand-orange mx-auto mb-2" />
              <p className="text-2xl font-bold">{completedTasks.length}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl border-gray-100 text-center">
            <CardContent className="p-4">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{pendingTasks.length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl border-gray-100 text-center">
            <CardContent className="p-4">
              <Target className="w-8 h-8 text-mint-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {currentChild.savingsGoal
                  ? Math.round((currentChild.savingsGoal.current / currentChild.savingsGoal.target) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-600">Goal</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button
            onClick={() => router.push("/child/games")}
            className="h-16 text-lg font-semibold bg-brand-orange text-white flex-col"
          >
            <GamepadIcon className="w-6 h-6 mb-1" />
            Play Games
          </Button>
          <Button
            onClick={() => router.push("/child/savings")}
            variant="outline"
            className="h-16 text-lg font-semibold border-brand-navy text-brand-navy flex-col"
          >
            <Target className="w-6 h-6 mb-1" />
            Savings Goal
          </Button>
          <Button
            onClick={() => router.push("/child/rewards")}
            className="h-16 text-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white flex-col md:col-span-1"
          >
            <ShoppingBag className="w-6 h-6 mb-1" />
            Rewards Store
          </Button>
        </div>

        {/* Internal Wallet / Pocket Money */}
        <Card className="bg-white shadow-lg rounded-xl border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-purple-500" />
              My Pocket Money (Internal Wallet)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <p className="text-lg font-medium text-purple-700">Balance:</p>
              <p className="text-2xl font-bold text-purple-700">Rs. {currentChild.internalWalletBalance}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Amount to move to Main Wallet:</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="e.g., 50"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="h-11"
                />
                <Button
                  onClick={handleDepositToMainWallet}
                  className="bg-purple-600 hover:bg-purple-700 text-white h-11"
                >
                  Move Money
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">This moves money from your Pocket Money to your Main Wallet.</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="bg-white shadow-lg rounded-xl border-gray-100 border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Your Tasks ({pendingTasks.length} pending)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">All tasks completed! 🎉</p>
                <p className="text-sm text-gray-500">Ask your parents for more tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <Card key={task.id} className="bg-white border border-gray-200 rounded-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{task.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <Badge variant="secondary" className="mt-2">
                            Earn Rs. {task.reward}
                          </Badge>
                        </div>
                        <Button className="ml-4 bg-brand-orange text-white" onClick={() => completeTask(task.id)}>
                          Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Goal */}
        {currentChild.savingsGoal && (
          <Card className="bg-white shadow-lg rounded-xl border-gray-100 border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Savings Goal: {currentChild.savingsGoal.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold">
                    Rs. {currentChild.savingsGoal.current} / Rs. {currentChild.savingsGoal.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-brand-orange h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((currentChild.savingsGoal.current / currentChild.savingsGoal.target) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-mint-600">
                    {Math.round((currentChild.savingsGoal.current / currentChild.savingsGoal.target) * 100)}% Complete!
                  </p>
                  <p className="text-sm text-gray-600">
                    Rs. {currentChild.savingsGoal.target - currentChild.savingsGoal.current} more to go!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Achievements */}
        {completedTasks.length > 0 && (
          <Card className="bg-white shadow-lg rounded-xl border-gray-100 border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedTasks
                  .slice(-3)
                  .reverse()
                  .map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-800">{task.title}</p>
                        <p className="text-sm text-green-600">Earned Rs. {task.reward}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Chatbot FAB */}
        <Button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-brand-orange text-white shadow-xl hover:bg-brand-orange/90 flex items-center justify-center z-20"
          aria-label="Open FinBuddy Chatbot"
        >
          <MessageCircle size={30} />
        </Button>

        {/* Chatbot Modal */}
        {showChatbot && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-lg">
              <AiChatbot />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChatbot(false)}
                className="absolute top-2 right-2 text-gray-600 hover:bg-gray-200 z-50"
                aria-label="Close chatbot"
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
