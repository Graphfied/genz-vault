export interface Task {
  id: string
  title: string
  description: string
  reward: number
  childId: string
  completed: boolean
  createdAt: string
}

export interface Child {
  id: string
  name: string
  age: number
  avatar: string
  balance: number
  parentId: string
  savingsGoal?: {
    title: string
    target: number
    current: number
  } | null
  cardDesign: {
    emoji: string
    background: string
    name: string
  }
  internalWalletBalance: number
}

export interface User {
  id: string
  name: string
  email: string
  type: "parent" | "child"
  parentId?: string
  avatar?: string
  age?: number
}
