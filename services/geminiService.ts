import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = "You are a world-class senior web developer and UI/UX designer. You write clean, modern, semantic code. When modifying code, you prioritize functionality and aesthetics. You strictly adhere to the user's request.";

export const analyzeCode = async (fileName: string, fileContent: string): Promise<string> => {
  try {
    const prompt = `
      Please analyze the following source code file named "${fileName}".
      
      Provide a response in Markdown format with the following sections:
      1. **Summary**: A brief explanation of what the code does.
      2. **Key Features**: Bullet points of important logic or styles.
      3. **Suggestions**: Potential improvements, best practices, or security considerations.
      
      Code Content:
      \`\`\`
      ${fileContent}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Error analyzing code with Gemini:", error);
    throw new Error("Failed to analyze code. Please check your API key and try again.");
  }
};

export const modifyCode = async (fileName: string, fileContent: string, instructions: string, imageBase64?: string): Promise<string> => {
  try {
    let contents: any;

    const textPart = {
        text: `
        The user wants to modify the file "${fileName}".
        
        Current Code:
        \`\`\`
        ${fileContent}
        \`\`\`
        
        User Instructions:
        "${instructions}"
        
        ${imageBase64 ? 'IMPORTANT: The user has provided an image. Analyze the visual design, layout, colors, and structure of the image and apply it to the code pixel-perfectly where possible.' : ''}
        
        Goal: Return the FULL updated content of the file based on the request.
        
        IMPORTANT RULES:
        1. **Images**: If adding images, use reliable placeholders like "https://picsum.photos/800/600" or specific unsplash sources.
        2. **Output Format**: Return ONLY the raw code. Do NOT wrap it in markdown code blocks (like \`\`\`html ... \`\`\`). Do NOT include any conversational text.
        3. **Completeness**: Do not use placeholders like "// ... rest of code". Return the complete file.
      `
    };

    if (imageBase64) {
        // Remove header if present (e.g., "data:image/jpeg;base64,")
        const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
        
        contents = {
            parts: [
                textPart,
                {
                    inlineData: {
                        mimeType: 'image/jpeg', 
                        data: cleanBase64
                    }
                }
            ]
        };
    } else {
        contents = textPart.text;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using 2.5 Flash for speed and reasoning on code
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Lower temperature for more deterministic code output
      }
    });

    let rawText = response.text || "";
    
    // Robust cleanup to handle markdown blocks if the model disobeys
    // 1. Try to match content inside ```language ... ```
    const codeBlockMatch = rawText.match(/```(?:\w+)?\s*([\s\S]*?)\s*```/);
    
    if (codeBlockMatch && codeBlockMatch[1]) {
        rawText = codeBlockMatch[1];
    } else {
        // 2. Fallback: simply strip start/end fences if they exist loosely
        rawText = rawText.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
    }
    
    return rawText.trim();
  } catch (error) {
    console.error("Error modifying code with Gemini:", error);
    throw new Error("Failed to modify code. Please try again.");
  }
};