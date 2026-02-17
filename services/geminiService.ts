
import { GoogleGenAI } from "@google/genai";
import { ProfileData, AnalysisResult } from "../types";

export const getAiSummary = async (data: ProfileData, result: Omit<AnalysisResult, 'summary'>): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this social media profile based on its metadata and our XGBoost-style classification result.
    
    Profile Data:
    - Username: ${data.username}
    - Followers: ${data.followers}
    - Following: ${data.following}
    - Posts: ${data.posts}
    - Bio Length: ${data.bioLength}
    - Has Avatar: ${data.hasAvatar}
    - Account Age: ${data.accountAgeDays} days
    - Digit Ratio in name: ${Math.round(data.digitRatio * 100)}%
    
    Classification Results:
    - Probability of being a FAKE account: ${Math.round(result.probability * 100)}%
    - Classification: ${result.isFake ? 'FAKE' : 'REAL'}
    
    SHAP Contributors:
    ${result.shapValues.map(v => `${v.label}: ${v.value > 0 ? 'Suspicious (+)' : 'Genuine (-)'} ${Math.abs(v.value).toFixed(2)}`).join('\n')}
    
    Task: Provide a concise, professional explanation (max 3 sentences) of why the model reached this conclusion. Focus on the strongest indicators.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate AI summary at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with AI analysis engine.";
  }
};
