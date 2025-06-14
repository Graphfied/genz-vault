"use client"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Plus,
  Wallet,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function ParentDashboard() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    dispatch({ type: "SET_USER", payload: null })
    router.push("/")
  }

  const completedTasks = state.tasks.filter((task) => task.completed).length
  const totalTasks = state.tasks.length
  const totalBalanceAllChildren = state.children.reduce((sum, child) => sum + (child.balance || 0), 0)
  const totalInternalWalletAllChildren = state.children.reduce(
    (sum, child) => sum + (child.internalWalletBalance || 0),
    0,
  )

  const [fundAmounts, setFundAmounts] = useState<
    Record<string, { topUpInternal: string; withdrawMain: string; depositMain: string }>
  >({})

  const handleFundAmountChange = (
    childId: string,
    type: "topUpInternal" | "withdrawMain" | "depositMain",
    value: string,
  ) => {
    setFundAmounts((prev) => ({
      ...prev,
      [childId]: {
        ...(prev[childId] || { topUpInternal: "", withdrawMain: "", depositMain: "" }),
        [type]: value,
      },
    }))
  }

  const handleTopUpInternalWallet = (childId: string) => {
    const amount = Number.parseFloat(fundAmounts[childId]?.topUpInternal || "0")
    if (amount > 0) {
      dispatch({ type: "TOPUP_INTERNAL_WALLET", payload: { childId, amount } })
      toast({
        title: "Success",
        description: `Rs. ${amount} added to ${state.children.find((c) => c.id === childId)?.name}'s pocket money.`,
      })
      handleFundAmountChange(childId, "topUpInternal", "")
    } else {
      toast({ title: "Error", description: "Please enter a valid amount.", variant: "destructive" })
    }
  }

  const handleParentDepositToMainBalance = (childId: string) => {
    const amount = Number.parseFloat(fundAmounts[childId]?.depositMain || "0")
    if (amount > 0) {
      dispatch({ type: "PARENT_DEPOSIT_TO_CHILD_MAIN_BALANCE", payload: { childId, amount } })
      toast({
        title: "Success",
        description: `Rs. ${amount} deposited to ${state.children.find((c) => c.id === childId)?.name}'s main balance.`,
      })
      handleFundAmountChange(childId, "depositMain", "")
    } else {
      toast({ title: "Error", description: "Please enter a valid amount.", variant: "destructive" })
    }
  }

  const handleWithdrawFromChildMainBalance = (childId: string) => {
    const child = state.children.find((c) => c.id === childId)
    const amount = Number.parseFloat(fundAmounts[childId]?.withdrawMain || "0")
    if (child && amount > 0) {
      if ((child.balance || 0) >= amount) {
        dispatch({ type: "WITHDRAW_FROM_CHILD_BALANCE", payload: { childId, amount } })
        toast({ title: "Success", description: `Rs. ${amount} withdrawn from ${child.name}'s main balance.` })
        handleFundAmountChange(childId, "withdrawMain", "")
      } else {
        toast({ title: "Error", description: "Insufficient balance in child's main wallet.", variant: "destructive" })
      }
    } else {
      toast({ title: "Error", description: "Please enter a valid amount or child not found.", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-inter text-brand-navy">Parent Dashboard</h1>
            <p className="text-gray-600">Welcome back, {state.currentUser?.name}!</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-brand-orange mx-auto mb-3" />
              <p className="text-3xl font-bold font-heading text-brand-navy">{state.children.length}</p>
              <p className="text-sm text-gray-500">Children</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-brand-orange mx-auto mb-3" />
              <p className="text-3xl font-bold font-heading text-brand-navy">Rs. {totalBalanceAllChildren}</p>
              <p className="text-sm text-gray-500">Total Main Balance</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
            <CardContent className="p-6 text-center">
              <Wallet className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <p className="text-3xl font-bold font-heading text-purple-600">Rs. {totalInternalWalletAllChildren}</p>
              <p className="text-sm text-gray-500">Total Pocket Money</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold font-heading text-green-600">{completedTasks}</p>
              <p className="text-sm text-gray-500">Tasks Done</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/parent/add-child")}
            className="h-16 text-lg font-semibold bg-brand-navy text-white"
          >
            <Plus className="w-6 h-6 mr-2" />
            Add Child
          </Button>
          <Button
            onClick={() => router.push("/parent/add-task")}
            variant="outline"
            className="h-16 text-lg font-semibold border-2 border-brand-orange text-brand-orange"
          >
            <Plus className="w-6 h-6 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Children Overview */}
        <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Children Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.children.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No children added yet</p>
                <Button onClick={() => router.push("/parent/add-child")}>Add Your First Child</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {state.children.map((child) => {
                  const childTasks = state.tasks.filter((task) => task.childId === child.id)
                  const completedChildTasks = childTasks.filter((task) => task.completed).length

                  return (
                    <Card key={child.id} className="border-gray-200 rounded-lg overflow-hidden">
                      <CardHeader className="bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-4xl">{child.avatar}</div>
                            <div>
                              <h3 className="font-semibold text-xl text-brand-navy">{child.name}</h3>
                              <p className="text-sm text-gray-600">Age {child.age}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => router.push(`/parent/child/${child.id}`)}>
                            View Details
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Main Balance</p>
                            <p className="text-lg font-bold text-green-600">Rs. {child.balance || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Pocket Money</p>
                            <p className="text-lg font-bold text-purple-600">Rs. {child.internalWalletBalance || 0}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {completedChildTasks}/{childTasks.length} tasks completed
                        </Badge>

                        {child.savingsGoal && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-800">Savings Goal: {child.savingsGoal.title}</p>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex-1 bg-blue-200 rounded-full h-2 mr-3">
                                <div
                                  className="bg-brand-orange h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(((child.savingsGoal.current || 0) / (child.savingsGoal.target || 1)) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium text-blue-700">
                                Rs. {child.savingsGoal.current || 0} / Rs. {child.savingsGoal.target || 0}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          <h4 className="text-sm font-semibold text-gray-700">Manage Funds:</h4>
                          {/* Deposit to Main Balance */}
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Deposit to Main Balance (Rs.):</label>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={fundAmounts[child.id]?.depositMain || ""}
                                onChange={(e) => handleFundAmountChange(child.id, "depositMain", e.target.value)}
                                className="h-9 text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleParentDepositToMainBalance(child.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3"
                              >
                                <ArrowDownCircle className="w-4 h-4 mr-1.5" /> Deposit
                              </Button>
                            </div>
                          </div>

                          {/* Top-up Pocket Money (Internal Wallet) */}
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Top-up Pocket Money (Rs.):</label>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={fundAmounts[child.id]?.topUpInternal || ""}
                                onChange={(e) => handleFundAmountChange(child.id, "topUpInternal", e.target.value)}
                                className="h-9 text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleTopUpInternalWallet(child.id)}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-3"
                              >
                                <Wallet className="w-4 h-4 mr-1.5" /> Top Up
                              </Button>
                            </div>
                          </div>

                          {/* Withdraw from Main Balance */}
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">
                              Withdraw from Main Balance (Rs.):
                            </label>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={fundAmounts[child.id]?.withdrawMain || ""}
                                onChange={(e) => handleFundAmountChange(child.id, "withdrawMain", e.target.value)}
                                className="h-9 text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleWithdrawFromChildMainBalance(child.id)}
                                variant="destructive"
                                className="px-3"
                              >
                                <ArrowUpCircle className="w-4 h-4 mr-1.5" /> Withdraw
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks (unchanged from previous version) */}
        <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.tasks.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No tasks created yet</p>
                <Button onClick={() => router.push("/parent/add-task")}>Create First Task</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {state.tasks
                  .slice(-5)
                  .reverse()
                  .map((task) => {
                    const child = state.children.find((c) => c.id === task.childId)
                    return (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-gray-600">
                            For: {child?.name} • Rs. {task.reward}
                          </p>
                        </div>
                        <Badge
                          variant={task.completed ? "default" : "secondary"}
                          className={task.completed ? "bg-green-500 text-white" : ""}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
