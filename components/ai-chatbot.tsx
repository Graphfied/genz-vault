"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Loader2, Sparkles } from "lucide-react"
import { generateAIResponse } from "@/lib/gemini" // Assuming this path is correct
import { useApp } from "@/contexts/AppContext"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AiChatbot({ initialPrompt }: { initialPrompt?: string }) {
  const { state } = useApp()
  const currentChild = state.children.find((child) => child.id === state.currentUser?.id)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector("div[data-radix-scroll-area-viewport]")
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (currentChild) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Assalam-o-Alaikum ${currentChild.name}! I'm FinBuddy, your personal finance guide. How can I help you today? You can ask me about saving, spending, or even how to use features in the app!`,
      }
      setMessages([welcomeMessage])

      if (initialPrompt) {
        handleSendMessage(initialPrompt, true)
      }
    }
  }, [currentChild, initialPrompt])

  const handleSendMessage = async (messageContent?: string, isSystemPrompt = false) => {
    const textToSend = messageContent || input
    if (!textToSend.trim() && !isSystemPrompt) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    }

    if (!isSystemPrompt) {
      setMessages((prevMessages) => [...prevMessages, userMessage])
    }
    setInput("")
    setIsLoading(true)

    try {
      const systemPrompt = `You are FinBuddy, a friendly, encouraging, and knowledgeable financial assistant for Pakistani kids and teens (current user: ${currentChild?.name}, age ${currentChild?.age}, balance Rs. ${currentChild?.balance}).
      Your goal is to teach them about money management (saving, smart spending, budgeting, basic halal earning/investing concepts) in a simple, step-by-step, and engaging way.
      Use simple English and mix in common Urdu words naturally (e.g., 'bachat' for saving, 'kharch' for spending, 'shabash' for well done, 'rupay' for rupees).
      Be culturally appropriate for Pakistan.
      If asked about actions on the platform (like "how to deposit money", "how to save for a toy", "how to buy rewards"), guide them on how to use the app's features.
      For example, to deposit from internal wallet: "Great question! To move your pocket money (internal wallet) to your main wallet, go to your dashboard. You'll see a 'My Pocket Money' section. Enter the amount you want to move and click 'Move Money'. Easy peasy!"
      For saving goals: "Shabash! To set a savings goal, go to your dashboard and find the 'Savings Goal' button or section. You can name your goal, set a target amount, and track your progress!"
      Keep responses concise, friendly, and actionable. Use emojis to make it fun.
      Do NOT invent features that don't exist. Stick to guiding on existing or plausible app functionalities.
      Do NOT perform transactions or modify account data directly. You are a guide.
      Current user's query: "${textToSend}"`

      const aiResponse = await generateAIResponse(systemPrompt)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
    } catch (error) {
      console.error("Error fetching AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops! I'm having a little trouble connecting right now. Please try again in a bit.",
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[70vh] max-h-[500px] bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="p-4 border-b flex items-center space-x-2">
        <Sparkles className="w-6 h-6 text-brand-orange" />
        <h3 className="text-lg font-semibold text-brand-navy">Chat with FinBuddy</h3>
      </div>
      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end space-x-2 ${message.role === "user" ? "justify-end" : ""}`}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
            )}
            <div
              className={`max-w-[70%] p-3 rounded-xl ${
                message.role === "user"
                  ? "bg-brand-navy text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0">
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0">
              <Bot size={18} />
            </div>
            <div className="max-w-[70%] p-3 rounded-xl bg-gray-100 text-gray-800 rounded-bl-none">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask FinBuddy anything..."
            className="flex-grow h-10 focus-visible:ring-brand-orange"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="bg-brand-orange hover:bg-brand-orange/90" disabled={isLoading}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  )
}
