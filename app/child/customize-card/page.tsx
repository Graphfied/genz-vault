"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, CreditCardIcon, ShoppingBag, XIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const avatarOptions = ["👦", "👧", "🧒", "👶", "🦸‍♂️", "🦸‍♀️", "🤓", "😊", "🌟", "🎨", "🚀", "⚽"]
const backgroundOptions = [
  { name: "Ocean Blue", class: "bg-gradient-to-br from-blue-500 to-cyan-400" },
  { name: "Sunset Orange", class: "bg-gradient-to-br from-orange-500 to-yellow-400" },
  { name: "Minty Green", class: "bg-gradient-to-br from-emerald-500 to-green-400" },
  { name: "Royal Purple", class: "bg-gradient-to-br from-purple-600 to-indigo-500" },
  { name: "Hot Pink", class: "bg-gradient-to-br from-pink-500 to-rose-500" },
  { name: "Galaxy Black", class: "bg-gradient-to-br from-slate-800 to-neutral-900" },
  { name: "Professional Silver", class: "bg-gradient-to-br from-slate-300 to-slate-500" },
  { name: "Professional Gold", class: "bg-gradient-to-br from-amber-300 to-yellow-500" },
]

const physicalCardDesigns = [
  {
    id: "pro-black",
    name: "Stealth Black",
    image: "/placeholder.svg?width=300&height=188",
    description: "Sleek and modern, for the minimalist teen.",
  },
  {
    id: "pro-silver",
    name: "Titanium Silver",
    image: "/placeholder.svg?width=300&height=188",
    description: "Cool metallic finish, durable and stylish.",
  },
  {
    id: "pro-blue",
    name: "Oceanic Blue",
    image: "/placeholder.svg?width=300&height=188",
    description: "Calm and confident, with a subtle wave pattern.",
  },
  {
    id: "pro-custom",
    name: "Your Design",
    image: "/placeholder.svg?width=300&height=188",
    description: "Upload your art or choose from exclusive designs (coming soon).",
  },
]

export default function CustomizeCardPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const currentChild = state.children.find((child) => child.id === state.currentUser?.id)

  const [selectedAvatar, setSelectedAvatar] = useState(currentChild?.cardDesign.emoji || avatarOptions[0])
  const [selectedBackground, setSelectedBackground] = useState(
    currentChild?.cardDesign.background || backgroundOptions[0].class,
  )
  const [cardName, setCardName] = useState(currentChild?.cardDesign.name || currentChild?.name || "")
  const [showPhysicalCardModal, setShowPhysicalCardModal] = useState(false)

  const handleSaveChanges = () => {
    if (currentChild) {
      const updatedChild = {
        ...currentChild,
        cardDesign: {
          emoji: selectedAvatar,
          background: selectedBackground,
          name: cardName,
        },
        avatar: selectedAvatar, // Also update main avatar if card emoji changes
      }
      dispatch({ type: "UPDATE_CHILD", payload: updatedChild })
      toast({
        title: "Card Updated! ✨",
        description: "Your cool new card design is saved.",
      })
      router.push("/child")
    }
  }

  const handleOrderPhysicalCard = (cardDesignId: string) => {
    toast({
      title: "Order Placed (Simulated)!",
      description: `Your request for the ${physicalCardDesigns.find((c) => c.id === cardDesignId)?.name || "card"} has been noted. We'll contact your parents soon!`,
      duration: 5000,
    })
    setShowPhysicalCardModal(false)
  }

  if (!currentChild) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p>Loading child data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push("/child")} className="text-brand-navy">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-heading font-bold text-brand-navy">Customize Your Card</h1>
        </div>

        <Card className="bg-white shadow-xl border-gray-200">
          <CardContent className="p-6 space-y-8">
            {/* Card Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-brand-navy text-center">Your Digital Card Preview</h3>
              <div
                className={`${selectedBackground} p-5 rounded-xl text-white shadow-2xl aspect-[1.586] max-w-sm mx-auto flex flex-col justify-between`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs opacity-90 font-semibold">KidsBank</p>
                    <p className="text-lg font-bold leading-tight">{cardName || "Your Name"}</p>
                  </div>
                  <div className="text-4xl">{selectedAvatar}</div>
                </div>
                <div className="mt-auto">
                  <p className="text-xs opacity-90">Balance</p>
                  <p className="text-2xl font-bold">Rs. {currentChild.balance}</p>
                </div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Card Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Enter name for card"
                  className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">Choose Avatar</label>
                <div className="grid grid-cols-6 gap-3">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-12 h-12 text-3xl rounded-xl border-2 flex items-center justify-center transition-all ${
                        selectedAvatar === avatar
                          ? "border-brand-orange bg-orange-50 scale-110 ring-2 ring-brand-orange"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">Card Background</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {backgroundOptions.map((bg) => (
                    <button
                      key={bg.name}
                      type="button"
                      onClick={() => setSelectedBackground(bg.class)}
                      title={bg.name}
                      className={`w-full h-16 rounded-xl border-2 transition-all ${bg.class} ${
                        selectedBackground === bg.class
                          ? "ring-2 ring-offset-2 ring-brand-orange scale-105 shadow-lg"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveChanges}
              size="lg"
              className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white h-12 text-lg"
            >
              <Check className="w-5 h-5 mr-2" />
              Save Changes
            </Button>

            <Button
              onClick={() => setShowPhysicalCardModal(true)}
              variant="outline"
              size="lg"
              className="w-full border-brand-navy text-brand-navy hover:bg-brand-navy/5 h-12 text-lg"
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Order a Physical Card (Future)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Physical Card Modal */}
      {showPhysicalCardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-xl border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-heading text-brand-navy">Choose Your Physical Card</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowPhysicalCardModal(false)}>
                <XIcon className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-600">
                Exciting news! Soon you'll be able to order a real KidsBank debit card. Here are some designs we're
                thinking about. Let us know which one you like!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {physicalCardDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="border p-3 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleOrderPhysicalCard(design.id)}
                  >
                    <Image
                      src={design.image || "/placeholder.svg"}
                      alt={design.name}
                      width={200}
                      height={125}
                      className="rounded-md mb-3 mx-auto aspect-[1.586] object-cover"
                    />
                    <h4 className="font-semibold text-center text-brand-navy">{design.name}</h4>
                    <p className="text-xs text-gray-500 text-center mt-1">{design.description}</p>
                    <Button size="sm" className="w-full mt-3 bg-brand-navy hover:bg-brand-navy/90 text-white">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Select this design
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-gray-500 mt-4">
                Physical cards will be subject to parental approval and terms & conditions. This is a simulated order
                for MVP.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
