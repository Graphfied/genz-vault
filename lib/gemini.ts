// Add export to generateAIResponse
export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    // ... existing code ...
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, // Using 1.5 flash and env var
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("Gemini API HTTP error response:", errorBody)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
    }

    const data = await response.json()

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      return data.candidates[0].content.parts[0].text
    } else if (data.promptFeedback && data.promptFeedback.blockReason) {
      console.warn("Gemini API prompt blocked:", data.promptFeedback.blockReason, data.promptFeedback.safetyRatings)
      return `I'm sorry, I can't respond to that due to safety guidelines. Reason: ${data.promptFeedback.blockReason}.`
    } else {
      console.warn("Invalid response format from Gemini API:", data)
      throw new Error("Invalid response format from Gemini API")
    }
  } catch (error) {
    console.error("Gemini API Error:", error)
    // Provide a more user-friendly error or rethrow
    return "Sorry, I encountered an error trying to process that request."
  }
}

interface AITaskData {
  title: string
  description: string
  reward: number
}

// Helper to get game names (could be dynamic later)
const getAvailableGames = (): string[] => {
  return ["Money Quest", "ChoreMaster", "Budget Battle", "Halal Hustle", "Startup Tycoon Jr.", "Savings Race"]
}

// Ensure Task type is imported or defined if not globally available
// Assuming Task type is defined in a way that's accessible, e.g., from context or a types file
// For this file, if Task is not directly available, you might need:
// import type { Task } from '../contexts/AppContext'; // Adjust path as needed

import type { Task } from "@/types"

export async function generateAITasksForChild(childName: string, childAge: number, childId: string): Promise<Task[]> {
  // Using any[] for tasks for now if Task type is complex to import here
  const availableGames = getAvailableGames()
  const gameListString = availableGames.join(", ")

  const prompt = `You are a creative task generator for a kids' financial literacy app called KidsBank.
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
    const responseString = await generateAIResponse(prompt)

    let rawTasks: AITaskData[] = []
    try {
      const jsonMatch = responseString.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch && jsonMatch[1]) {
        rawTasks = JSON.parse(jsonMatch[1])
      } else {
        rawTasks = JSON.parse(responseString)
      }
    } catch (e) {
      console.error("Failed to parse AI task response as JSON:", responseString, e)
      try {
        const objects = responseString.match(/\{[^}]+\}/g)
        if (objects) {
          rawTasks = objects.map((objStr) => JSON.parse(objStr))
        } else {
          throw new Error("No JSON objects found in response.")
        }
      } catch (e2) {
        console.error("Secondary attempt to parse AI tasks failed:", e2)
        return []
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
          reward: Number.isFinite(taskData.reward) ? Math.max(10, Math.min(150, taskData.reward)) : 50,
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
