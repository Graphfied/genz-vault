export interface Task {
  id: string
  title: string
  description: string
  reward: number
  childId: string
  completed: boolean
  createdAt: string
}

// Add other shared types here as your app grows
// For example:
// export interface User { ... }
// export interface Child { ... }
