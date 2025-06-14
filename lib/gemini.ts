import { callGeminiApi } from "@/app/actions/gemini-actions"
import type { Task } from "@/types"

// This function now acts as a wrapper if needed, or can be bypassed
// if generateAITasksForChild calls callGeminiApi directly.
// For simplicity, we'll keep it to maintain the existing export.
export async function generateAIResponse(prompt: string): Promise<string> {
  return callGeminiApi(prompt)
}

interface AITaskData {
  title: string
  description: string
  reward: number
}

const getAvailableGames = (): string[] => {
  return ["Money Quest", "ChoreMaster", "Budget Battle", "Halal Hustle", "Startup Tycoon Jr.", "Savings Race"]
}

export async function generateAITasksForChild(childName: string, childAge: number, childId: string): Promise<Task[]> {
  const availableGames = getAvailableGames()
  const gameListString = availableGames.join(", ")

  // Updated prompt to use "Genz Vault"
  const prompt = `You are a creative task generator for a kids' financial literacy app called "Genz Vault".
Generate 3-4 engaging tasks for a child named ${childName}, who is ${childAge} years old.
The tasks should promote financial literacy, responsibility, or learning through play.
Some tasks MUST involve playing educational games available in the app. The available games are: ${gameListString}.
When creating a game-based task, clearly state the game and a simple objective (e.g., "Play 'Budget Battle' and answer 3 questions correctly").
Tasks should have a title, a kid-friendly description, and a suggested reward in Pakistani Rupees (Rs.) between 20 and 100.
Ensure tasks are culturally relevant for Pakistan and use simple language.
Format the output as a JSON array of objects. Each object MUST have "title" (string), "description" (string), and "reward" (number).

Example of a game-based task description: "Play 'Budget Battle' and try to get a score of 70% or higher to understand smart spending!"
Example of a non-game task: "Help set the table for dinner for 3 days this week."

Provide ONLY the JSON array in your response.
`

  try {
    const responseString = await callGeminiApi(prompt) // Use the server action

    let rawTasks: AITaskData[] = []
    try {
      // Attempt to parse JSON, looking for markdown code blocks first
      const jsonMatch = responseString.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch && jsonMatch[1]) {
        rawTasks = JSON.parse(jsonMatch[1])
      } else {
        // Fallback to parsing the whole string if no markdown block
        rawTasks = JSON.parse(responseString)
      }
    } catch (e) {
      console.error("Failed to parse AI task response as JSON:", responseString, e)
      // Attempt to extract JSON objects if the main parsing fails (e.g., if there's leading/trailing text)
      try {
        const objects = responseString.match(/\{[^}]+\}/g)
        if (objects) {
          rawTasks = objects.map((objStr) => JSON.parse(objStr))
        } else {
          throw new Error("No JSON objects found in response string.")
        }
      } catch (e2) {
        console.error("Secondary attempt to parse AI tasks failed:", e2)
        return [] // Return empty if all parsing fails
      }
    }

    if (!Array.isArray(rawTasks)) {
      console.error("AI task response is not an array:", rawTasks)
      return []
    }

    return rawTasks.map(
      (taskData) =>
        ({
          id: `task-ai-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          title: taskData.title || "AI Generated Task",
          description: taskData.description || "Complete this AI generated task.",
          // Ensure reward is a number and within a sensible range
          reward: Number.isFinite(taskData.reward) ? Math.max(10, Math.min(150, Number(taskData.reward))) : 50,
          childId: childId,
          completed: false,
          createdAt: new Date().toISOString(),
        }) as Task,
    )
  } catch (error) {
    console.error("Error generating AI tasks:", error)
    return []
  }
}
