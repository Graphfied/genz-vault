"use server"

export async function callGeminiApi(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables.")
      throw new Error("GEMINI_API_KEY is not set.")
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
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
      console.error("Gemini API HTTP error response:", errorBody, "Status:", response.status)
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
    console.error("Gemini API Error in Server Action:", error)
    if (error instanceof Error) {
      return `Sorry, I encountered an error trying to process that request: ${error.message}`
    }
    return "Sorry, I encountered an unknown error trying to process that request."
  }
}
