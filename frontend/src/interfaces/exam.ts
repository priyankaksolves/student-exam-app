// Create an exam
export interface Exam {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isLive: boolean;
  createdBy?: number;
  // Add other properties as needed
}