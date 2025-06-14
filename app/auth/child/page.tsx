"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ChildAuth() {
  const [selectedChild, setSelectedChild] = useState<string>("")
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()

  const handleChildLogin = () => {
    if (selectedChild) {
      const child = state.children.find((c) => c.id === selectedChild)
      if (child) {
        const user = {
          id: child.id,
          name: child.name,
          email: "",
          type: "child" as const,
          parentId: child.parentId,
          avatar: child.avatar,
          age: child.age,
        }
        dispatch({ type: "SET_USER", payload: user })
        toast({
          title: `Welcome ${child.name}! 🎉`,
          description: "Ready to learn and earn?",
        })
        router.push("/child")
      }
    }
  }

  if (state.children.length === 0) {
    return (
      <div className="min-h-screen flex flex-col p-4 bg-brand-lightPink">
        <Button variant="ghost" onClick={() => router.push("/")} className="self-start mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl border-gray-200 bg-white text-center">
            <CardContent className="p-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-orange to-orange-400 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Child Accounts Yet</h2>
              <p className="text-gray-600 mb-6">Ask your parent to create an account for you first!</p>
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
              >
                Go Back Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-brand-lightPink">
      <Button variant="ghost" onClick={() => router.push("/")} className="self-start mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-gray-200 bg-white">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-orange to-orange-400 rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-heading">Choose Your Profile</CardTitle>
            <p className="text-gray-600">Select your account to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.children.map((child) => (
              <Card
                key={child.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedChild === child.id ? "ring-2 ring-brand-orange bg-orange-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedChild(child.id)}
              >
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="text-3xl">{child.avatar}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{child.name}</h3>
                    <p className="text-sm text-gray-600">Age {child.age}</p>
                    <p className="text-sm font-medium text-green-600">Balance: Rs. {child.balance}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={handleChildLogin}
              disabled={!selectedChild}
              className="w-full h-12 text-lg font-semibold bg-brand-orange text-white hover:bg-brand-orange/90"
            >
              Login & Play! 🎮
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
