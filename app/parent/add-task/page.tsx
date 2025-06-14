"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateAITasksForChild } from "@/lib/gemini" // Import the new function

const taskTemplates = [
  { title: "Clean your room", description: "Organize and clean your bedroom", reward: 50 },
  { title: "Read 5 pages", description: "Read 5 pages from any book", reward: 30 },
  { title: "Help with dishes", description: "Help wash or dry the dishes", reward: 40 },
  { title: "Complete homework", description: "Finish all school assignments", reward: 60 },
  { title: "Practice Quran recitation", description: "Practice reading Quran for 15 minutes", reward: 70 },
  { title: "Help with groceries", description: "Help carry groceries or organize them", reward: 45 },
]

export default function AddTask() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
    childId: "",
  })
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [isGeneratingAITasks, setIsGeneratingAITasks] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.title && formData.description && formData.reward && formData.childId) {
      const newTask = {
        id: `task-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        reward: Number.parseInt(formData.reward),
        childId: formData.childId,
        completed: false,
        createdAt: new Date().toISOString(),
      }

      dispatch({ type: "ADD_TASK", payload: newTask })
      toast({
        title: "Task created! 📝",
        description: `${formData.title} has been assigned`,
      })
      // Optionally clear form or redirect
      // router.push("/parent")
      setFormData({ title: "", description: "", reward: "", childId: formData.childId }) // Keep child selected
    } else {
      toast({
        title: "Missing Fields",
        description: "Please fill out all fields to create a task.",
        variant: "destructive",
      })
    }
  }

  const useTemplate = useCallback(
    (template: (typeof taskTemplates)[0]) => {
      setFormData((prev) => ({
        ...prev,
        title: template.title,
        description: template.description,
        reward: template.reward.toString(),
      }))
    },
    [], // formData dependency removed to prevent re-creation if childId changes
  )

  const handleGenerateAITasks = async () => {
    if (!formData.childId) {
      toast({
        title: "Select a Child",
        description: "Please select a child to generate AI tasks for.",
        variant: "destructive",
      })
      return
    }

    const selectedChild = state.children.find((c) => c.id === formData.childId)
    if (!selectedChild) {
      toast({ title: "Error", description: "Selected child not found.", variant: "destructive" })
      return
    }

    setIsGeneratingAITasks(true)
    try {
      const aiTasks = await generateAITasksForChild(selectedChild.name, selectedChild.age, selectedChild.id)
      if (aiTasks.length > 0) {
        dispatch({ type: "ADD_MULTIPLE_TASKS", payload: aiTasks })
        toast({
          title: "AI Tasks Generated! ✨",
          description: `${aiTasks.length} new tasks added for ${selectedChild.name}. You can see them on the dashboard.`,
        })
      } else {
        toast({
          title: "No AI Tasks Generated",
          description: "The AI couldn't generate tasks this time. Please try again.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Failed to generate AI tasks:", error)
      toast({
        title: "AI Task Generation Failed",
        description: "An error occurred while trying to generate tasks.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAITasks(false)
    }
  }

  const TemplateButton = ({ template, onClick }: { template: (typeof taskTemplates)[0]; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-medium text-sm">{template.title}</p>
          <p className="text-xs text-gray-600 mt-1">{template.description}</p>
        </div>
        <span className="text-sm font-semibold text-green-600 ml-2">Rs. {template.reward}</span>
      </div>
    </button>
  )

  const TaskTemplatesSection = () => {
    const handleTemplateClick = (template: (typeof taskTemplates)[0]) => {
      useTemplate(template)
    }

    return (
      <Card className="bg-white shadow-xl border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Quick Templates (Manual)</CardTitle>
          <p className="text-sm text-gray-600">Tap to use a template for manual task creation</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {taskTemplates.map((template, index) => (
              <TemplateButton key={index} template={template} onClick={() => handleTemplateClick(template)} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const NoChildren = () => (
    <div className="min-h-screen bg-slate-50 p-4">
      <Button variant="ghost" onClick={() => router.push("/parent")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="max-w-xl mx-auto">
        <Card className="bg-white shadow-xl border-gray-200 text-center">
          <CardContent className="p-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Children Added</h2>
            <p className="text-gray-600 mb-6">You need to add a child first before creating tasks</p>
            <Button onClick={() => router.push("/parent/add-child")} className="w-full">
              Add Child First
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (state.children.length === 0) {
    return <NoChildren />
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Button variant="ghost" onClick={() => router.push("/parent")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="max-w-xl mx-auto space-y-6">
        <Card className="bg-white shadow-xl border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-inter">Create New Task</CardTitle>
            <p className="text-gray-600">Assign a task to earn rewards</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Assign to Child</label>
                <Select
                  value={formData.childId}
                  onValueChange={(value) => setFormData({ ...formData, childId: value })}
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a child" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.avatar} {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Task Title</label>
                <Input
                  type="text"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  placeholder="Describe what needs to be done"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[80px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reward (Rs.)</label>
                <Input
                  type="number"
                  placeholder="Enter reward amount"
                  min="1"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold">
                Create Task Manually
              </Button>
            </form>
            <div className="mt-4 border-t pt-4">
              <Button
                onClick={handleGenerateAITasks}
                className="w-full h-12 text-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white"
                disabled={isGeneratingAITasks || !formData.childId}
              >
                {isGeneratingAITasks ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                Generate Tasks with AI for{" "}
                {state.children.find((c) => c.id === formData.childId)?.name || "Selected Child"}
              </Button>
              {!formData.childId && (
                <p className="text-xs text-center text-red-500 mt-1">
                  Please select a child first to enable AI task generation.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Task Templates */}
        <TaskTemplatesSection />
      </div>
    </div>
  )
}
