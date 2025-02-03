// Create an exam
export interface Exam {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: number;
  isLive: boolean;
  createdBy: string;
  // Add other properties as needed
}