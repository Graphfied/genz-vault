"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Users } from "lucide-react"

export default function LoginOptionsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-lightPink">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => router.push("/")} className="text-brand-navy hover:bg-brand-navy/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-xl border-gray-200 bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-orange to-orange-400 rounded-2xl flex items-center justify-center mb-4 shadow-md">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-heading">Welcome to KidsBank!</CardTitle>
          <p className="text-gray-600">Please select your login type.</p>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <Button
            onClick={() => router.push("/auth/parent")}
            className="w-full h-16 text-lg font-semibold bg-brand-navy text-white hover:bg-brand-navy/90 flex items-center justify-center space-x-3"
          >
            <Users className="w-6 h-6" />
            <span>Parent Login / Sign Up</span>
          </Button>
          <Button
            onClick={() => router.push("/auth/child")}
            variant="outline"
            className="w-full h-16 text-lg font-semibold border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white flex items-center justify-center space-x-3"
          >
            <User className="w-6 h-6" />
            <span>Child Login</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
