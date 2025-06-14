"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  type: "parent" | "child"
  parentId?: string
  avatar?: string
  age?: number
}

interface Child {
  id: string
  name: string
  age: number
  avatar: string
  balance: number // Main balance
  parentId: string
  savingsGoal?: {
    title: string
    target: number
    current: number
  } | null // Allow null for savingsGoal
  cardDesign: {
    emoji: string
    background: string
    name: string
  }
  internalWalletBalance: number // Pocket money
}

export interface Task {
  // Exporting Task interface
  id: string
  title: string
  description: string
  reward: number
  childId: string
  completed: boolean
  createdAt: string
}

interface AppState {
  currentUser: User | null
  children: Child[]
  tasks: Task[]
  isLoading: boolean
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "ADD_CHILD"; payload: Child }
  | { type: "UPDATE_CHILD"; payload: Child }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "ADD_MULTIPLE_TASKS"; payload: Task[] }
  | { type: "COMPLETE_TASK"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_DATA"; payload: Partial<AppState> }
  | { type: "TOPUP_INTERNAL_WALLET"; payload: { childId: string; amount: number } } // Parent adds to child's pocket money
  | { type: "PARENT_DEPOSIT_TO_CHILD_MAIN_BALANCE"; payload: { childId: string; amount: number } } // Parent adds to child's main balance
  | { type: "WITHDRAW_FROM_CHILD_BALANCE"; payload: { childId: string; amount: number } } // Parent withdraws from child's main balance
  | { type: "DEPOSIT_TO_MAIN_WALLET"; payload: { childId: string; amount: number } } // Child moves from pocket money to main
  | { type: "PURCHASE_REWARD"; payload: { childId: string; cost: number; rewardName: string } }

const initialState: AppState = {
  currentUser: null,
  children: [],
  tasks: [],
  isLoading: true,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, currentUser: action.payload }
    case "ADD_CHILD":
      return { ...state, children: [...state.children, action.payload] }
    case "UPDATE_CHILD":
      return {
        ...state,
        children: state.children.map((child) => (child.id === action.payload.id ? action.payload : child)),
      }
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] }
    case "ADD_MULTIPLE_TASKS":
      return { ...state, tasks: [...state.tasks, ...action.payload] }
    case "COMPLETE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload ? { ...task, completed: true } : task)),
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "LOAD_DATA":
      return {
        ...state,
        currentUser: action.payload.currentUser || null,
        tasks: action.payload.tasks || [],
        children: action.payload.children
          ? action.payload.children.map((child: any) => ({
              ...child,
              balance: child.balance || 0,
              internalWalletBalance: child.internalWalletBalance || 0,
              cardDesign: child.cardDesign || {
                emoji: child.avatar || "👦",
                background: "bg-gradient-to-br from-blue-400 to-purple-500",
                name: child.name || "Child Name",
              },
              savingsGoal: child.savingsGoal || null,
            }))
          : [],
      }
    case "TOPUP_INTERNAL_WALLET": // Parent adds to child's pocket money
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? { ...child, internalWalletBalance: (child.internalWalletBalance || 0) + action.payload.amount }
            : child,
        ),
      }
    case "PARENT_DEPOSIT_TO_CHILD_MAIN_BALANCE": // Parent adds to child's main balance
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? { ...child, balance: (child.balance || 0) + action.payload.amount }
            : child,
        ),
      }
    case "WITHDRAW_FROM_CHILD_BALANCE": // Parent withdraws from child's main balance
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? { ...child, balance: Math.max(0, (child.balance || 0) - action.payload.amount) }
            : child,
        ),
      }
    case "DEPOSIT_TO_MAIN_WALLET": // Child moves from pocket money to main
      return {
        ...state,
        children: state.children.map((child) => {
          if (child.id === action.payload.childId) {
            const amountToMove = Math.min(action.payload.amount, child.internalWalletBalance || 0)
            return {
              ...child,
              balance: (child.balance || 0) + amountToMove,
              internalWalletBalance: Math.max(0, (child.internalWalletBalance || 0) - amountToMove),
            }
          }
          return child
        }),
      }
    case "PURCHASE_REWARD":
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? { ...child, balance: Math.max(0, (child.balance || 0) - action.payload.cost) }
            : child,
        ),
      }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  saveToStorage: () => void
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const saveToStorage = () => {
    if (typeof window !== "undefined") {
      const dataToSave = {
        currentUser: state.currentUser,
        children: state.children.map((child) => ({
          ...child,
          balance: child.balance || 0,
          internalWalletBalance: child.internalWalletBalance || 0,
          savingsGoal: child.savingsGoal || null,
          cardDesign: child.cardDesign || {
            emoji: child.avatar || "👦",
            background: "bg-gradient-to-br from-blue-400 to-purple-500",
            name: child.name || "Child Name",
          },
        })),
        tasks: state.tasks,
      }
      localStorage.setItem("kidsbank-data", JSON.stringify(dataToSave))
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kidsbank-data")
      if (saved) {
        try {
          const data = JSON.parse(saved)
          dispatch({ type: "LOAD_DATA", payload: data })
        } catch (error) {
          console.error("Failed to load saved data:", error)
          dispatch({ type: "LOAD_DATA", payload: { currentUser: null, children: [], tasks: [] } })
        }
      } else {
        dispatch({ type: "LOAD_DATA", payload: { currentUser: null, children: [], tasks: [] } })
      }
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  useEffect(() => {
    if (!state.isLoading) {
      saveToStorage()
    }
  }, [state.currentUser, state.children, state.tasks, state.isLoading])

  return <AppContext.Provider value={{ state, dispatch, saveToStorage }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
