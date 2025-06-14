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

export default function ParentAuth() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const { dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Hardcoded authentication for MVP
    if (isLogin) {
      // Login logic
      if (formData.email && formData.password) {
        const user = {
          id: "parent-1",
          name: formData.name || "Parent",
          email: formData.email,
          type: "parent" as const,
        }
        dispatch({ type: "SET_USER", payload: user })
        toast({
          title: "Welcome back! 👋",
          description: "Successfully logged in as parent",
        })
        router.push("/parent")
      }
    } else {
      // Signup logic
      if (formData.name && formData.email && formData.password) {
        const user = {
          id: "parent-1",
          name: formData.name,
          email: formData.email,
          type: "parent" as const,
        }
        dispatch({ type: "SET_USER", payload: user })
        toast({
          title: "Account created! 🎉",
          description: "Welcome to KidsBank family",
        })
        router.push("/parent")
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-brand-lightPink">
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="self-start mb-4 text-brand-navy hover:bg-brand-navy/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-gray-200 bg-white">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-orange to-orange-400 rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-heading">
              {isLogin ? "Parent Login" : "Create Parent Account"}
            </CardTitle>
            <p className="text-gray-600">{isLogin ? "Welcome back!" : "Start your family's financial journey"}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 focus-visible:ring-brand-orange"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="parent@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 focus-visible:ring-brand-orange"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 focus-visible:ring-brand-orange"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-brand-navy text-white hover:bg-brand-navy/90"
              >
                {isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-brand-orange hover:underline font-medium">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>

            {/* Demo credentials */}
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs text-orange-700 font-medium">Demo Credentials:</p>
              <p className="text-xs text-orange-600">Email: demo@parent.com</p>
              <p className="text-xs text-orange-600">Password: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
