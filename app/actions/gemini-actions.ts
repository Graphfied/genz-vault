"use server"

interface GeminiResponsePart {
  text: string
}

interface GeminiCandidateContent {
  parts: GeminiResponsePart[]
  role: string
}

interface GeminiCandidate {
  content: GeminiCandidateContent
  finishReason: string
  index: number
  safetyRatings: Array<{ category: string; probability: string }>
}

interface GeminiAPIResponse {
  candidates?: GeminiCandidate[]
  promptFeedback?: {
    blockReason?: string
    safetyRatings: Array<{ category: string; probability: string }>
  }
}

export async function callGeminiApi(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.")
    return "API key not configured. Please contact support."
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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

    const data: GeminiAPIResponse = await response.json()

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
      // Check for specific error structures if available from Gemini docs
      // For example, if the API returns an error object:
      // if (data.error) {
      //   return `API Error: ${data.error.message}`;
      // }
      return "Received an unexpected response format from the AI service."
    }
  } catch (error: any) {
    console.error("Gemini API Call Error:", error)
    return `Sorry, I encountered an error trying to process that request: ${error.message || "Unknown error"}`
  }
}
