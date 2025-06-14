"use client"

import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RewardItem {
  id: string
  name: string
  description: string
  price: number
  icon: string // Emoji or Lucide icon name
  color: string // Tailwind gradient class
}

const availableRewards: RewardItem[] = [
  {
    id: "screen_time_30",
    name: "Extra 30min Screen Time",
    description: "Enjoy more time on your favorite game or show!",
    price: 100,
    icon: "🎮",
    color: "from-blue-400 to-purple-500",
  },
  {
    id: "story_book",
    name: "New Story Book",
    description: "Unlock a cool new digital story book.",
    price: 250,
    icon: "📚",
    color: "from-green-400 to-blue-500",
  },
  {
    id: "virtual_pet_accessory",
    name: "Virtual Pet Accessory",
    description: "A fancy hat for your virtual pet!",
    price: 75,
    icon: "🎩",
    color: "from-pink-400 to-red-500",
  },
  {
    id: "custom_avatar_pack",
    name: "Cool Avatar Pack",
    description: "Get new items to customize your app avatar.",
    price: 150,
    icon: "🧑‍🎨",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "donate_charity_small",
    name: "Donate Rs.50 to Charity",
    description: "Help others by donating a small amount.",
    price: 50,
    icon: "💖",
    color: "from-teal-400 to-cyan-500",
  },
]

export default function RewardsStorePage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const currentChild = state.children.find((child) => child.id === state.currentUser?.id)

  const handlePurchaseReward = (reward: RewardItem) => {
    if (currentChild) {
      if (currentChild.balance >= reward.price) {
        dispatch({
          type: "PURCHASE_REWARD",
          payload: { childId: currentChild.id, cost: reward.price, rewardName: reward.name },
        })
        toast({
          title: "Reward Claimed! 🎁",
          description: `You got ${reward.name}! Rs. ${reward.price} has been deducted.`,
        })
      } else {
        toast({
          title: "Not enough money!",
          description: `You need Rs. ${reward.price - currentChild.balance} more for ${reward.name}. Keep saving or complete tasks!`,
          variant: "destructive",
        })
      }
    }
  }

  if (!currentChild) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p>Loading child data...</p>
        <Button onClick={() => router.push("/")} className="ml-4">
          Go Home
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/child")} className="text-brand-navy">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold font-inter text-brand-navy">Rewards Store</h1>
            <p className="text-sm text-gray-600">Spend your earnings wisely!</p>
          </div>
          <div className="flex items-center space-x-2 text-lg font-semibold text-brand-orange">
            <span>Rs. {currentChild.balance}</span>
            {currentChild.avatar}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <Card className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg">
          <CardContent className="p-6 flex items-center space-x-4">
            <Sparkles className="w-10 h-10" />
            <div>
              <h2 className="text-xl font-bold">Treat Yourself!</h2>
              <p className="text-sm opacity-90">You've worked hard. Use your earnings to get cool rewards.</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRewards.map((reward) => (
            <Card key={reward.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
              <div
                className={`h-32 bg-gradient-to-br ${reward.color} flex items-center justify-center text-5xl text-white`}
              >
                {reward.icon}
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="text-lg font-semibold text-brand-navy">{reward.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              </CardContent>
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-brand-orange">Rs. {reward.price}</p>
                  <Button
                    onClick={() => handlePurchaseReward(reward)}
                    disabled={currentChild.balance < reward.price}
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Get Reward
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-xs text-center text-gray-500 mt-4">
          More rewards coming soon! All rewards are digital for now.
        </p>
      </div>
    </div>
  )
}
