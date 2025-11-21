import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        You are an expert web developer and builder assisting a user in real-time.
        The user wants to modify the file "${fileName}".
        
        Current Code:
        \`\`\`
        ${fileContent}
        \`\`\`
        
        User Instructions:
        "${instructions}"
        
        ${imageBase64 ? 'IMPORTANT: The user has provided an image. Analyze the visual design, layout, colors, and structure of the image and apply it to the code.' : ''}
        
        Goal: Implement the user's request into the code. 
        
        IMPORTANT RULES:
        1. **Images**: If the user asks to add an image or photo, use a high-quality random placeholder URL. 
           - For specific topics: "https://source.unsplash.com/random/800x600/?nature" (replace 'nature' with context).
           - Or use "https://picsum.photos/800/600".
        2. **No Markdown**: Return ONLY the full, updated content of the file. Do NOT include markdown code fences (like \`\`\`html). 
        3. **No Chat**: Do NOT include any conversational text.
        4. **Valid Code**: The output must be valid code for the file type.
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
      model: 'gemini-2.5-flash',
      contents: contents,
    });

    let rawText = response.text || "";
    
    // Advanced cleanup to handle markdown blocks if the model disobeys
    const codeBlockMatch = rawText.match(/^```(?:\w+)?\s*([\s\S]*?)\s*```$/);
    if (codeBlockMatch) {
        rawText = codeBlockMatch[1];
    } else {
        rawText = rawText.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
    }
    
    return rawText.trim();
  } catch (error) {
    console.error("Error modifying code with Gemini:", error);
    throw new Error("Failed to modify code. Please try again.");
  }
};