export interface ProjectFile {
    name: string;
    language: string;
    content: string;
}

export interface AnalysisResult {
    file: string;
    content: string;
}

export enum AnalysisStatus {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    image?: string; // Base64 string of the uploaded image
    timestamp: number;
}