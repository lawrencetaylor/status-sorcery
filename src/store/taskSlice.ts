import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  dueDate: string | null;
  category: string | null;
}

interface TaskState {
  tasks: Task[];
  categories: string[];
}

const initialState: TaskState = {
  tasks: [],
  categories: ['Work', 'Personal', 'Shopping', 'Health']
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id'>>) => {
      const newTask = {
        ...action.payload,
        id: crypto.randomUUID()
      };
      state.tasks.push(newTask);
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string; status: Task['status'] }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
      }
    },
    updateTaskDueDate: (state, action: PayloadAction<{ taskId: string; dueDate: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.dueDate = action.payload.dueDate;
      }
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    }
  }
});

export const { addTask, updateTaskStatus, updateTaskDueDate, addCategory } = taskSlice.actions;
export default taskSlice.reducer;