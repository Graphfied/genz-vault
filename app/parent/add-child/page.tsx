"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const avatarOptions = ["👦", "👧", "🧒", "👶", "🦸‍♂️", "🦸‍♀️", "🤓", "😊", "🌟", "🎨"]
const backgroundOptions = [
  "bg-gradient-to-br from-blue-400 to-purple-500",
  "bg-gradient-to-br from-green-400 to-blue-500",
  "bg-gradient-to-br from-pink-400 to-red-500",
  "bg-gradient-to-br from-yellow-400 to-orange-500",
  "bg-gradient-to-br from-purple-400 to-pink-500",
  "bg-gradient-to-br from-indigo-400 to-blue-500",
]

export default function AddChild() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    avatar: "👦",
    cardBackground: backgroundOptions[0],
  })
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.name && formData.age) {
      const newChild = {
        id: `child-${Date.now()}`,
        name: formData.name,
        age: Number.parseInt(formData.age),
        avatar: formData.avatar,
        balance: 0,
        parentId: state.currentUser?.id || "parent-1",
        cardDesign: {
          emoji: formData.avatar,
          background: formData.cardBackground,
          name: formData.name,
        },
        internalWalletBalance: 0,
      }

      dispatch({ type: "ADD_CHILD", payload: newChild })
      toast({
        title: "Child added successfully! 🎉",
        description: `${formData.name} can now start their financial journey`,
      })
      router.push("/parent")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Button variant="ghost" onClick={() => router.push("/parent")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="max-w-lg mx-auto">
        <Card className="bg-white shadow-xl border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-mint-400 to-blue-400 rounded-2xl flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-inter">Add New Child</CardTitle>
            <p className="text-gray-600">Create an account for your child</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Child's Name</label>
                <Input
                  type="text"
                  placeholder="Enter child's name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <Input
                  type="number"
                  placeholder="Age (8-18)"
                  min="8"
                  max="18"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Choose Avatar</label>
                <div className="grid grid-cols-5 gap-3">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar })}
                      className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                        formData.avatar === avatar
                          ? "border-blue-500 bg-blue-50 scale-110"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Card Background</label>
                <div className="grid grid-cols-3 gap-3">
                  {backgroundOptions.map((bg, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, cardBackground: bg })}
                      className={`w-full h-12 rounded-xl border-2 transition-all ${bg} ${
                        formData.cardBackground === bg ? "border-white scale-105 shadow-lg" : "border-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium mb-3 text-center">Card Preview</p>
                <div className={`${formData.cardBackground} p-4 rounded-xl text-white shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">KidsBank</p>
                      <p className="text-lg font-bold">{formData.name || "Child Name"}</p>
                    </div>
                    <div className="text-3xl">{formData.avatar}</div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm opacity-90">Balance</p>
                    <p className="text-xl font-bold">Rs. 0</p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold brand-navy">
                Create Child Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
