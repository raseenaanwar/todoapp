
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subtasks?: string[];
}

export type FilterType = 'all' | 'active' | 'completed';
