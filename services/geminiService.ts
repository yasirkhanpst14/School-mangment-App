import { GoogleGenAI } from "@google/genai";
import { StudentFullProfile, SemesterResult } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStudentReport = async (student: StudentFullProfile): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI service unavailable. Please check API Key configuration.";

  const prompt = `
    You are an academic advisor for a primary school named "GPS No 1 Bazar".
    Analyze the following student's performance and provide a constructive, encouraging report card comment for the parents.
    
    Student Name: ${student.name}
    Class: ${student.grade}
    
    Academic Data:
    ${student.results.map(res => `
      Semester ${res.semester}:
      Percentage: ${res.percentage.toFixed(2)}%
      Scores: ${JSON.stringify(res.scores)}
    `).join('\n')}

    Please keep the tone professional but warm. Highlight strengths and suggest areas for improvement. Keep it under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate report.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error communicating with AI service.";
  }
};
