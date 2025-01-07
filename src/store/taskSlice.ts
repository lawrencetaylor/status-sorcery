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
    },
    updateCategory: (state, action: PayloadAction<{ oldName: string; newName: string }>) => {
      const index = state.categories.indexOf(action.payload.oldName);
      if (index !== -1) {
        state.categories[index] = action.payload.newName;
        // Update all tasks using this category
        state.tasks.forEach(task => {
          if (task.category === action.payload.oldName) {
            task.category = action.payload.newName;
          }
        });
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat !== action.payload);
      // Remove category from tasks using it
      state.tasks.forEach(task => {
        if (task.category === action.payload) {
          task.category = null;
        }
      });
    }
  }
});

export const { 
  addTask, 
  updateTaskStatus, 
  updateTaskDueDate, 
  addCategory,
  updateCategory,
  deleteCategory 
} = taskSlice.actions;
export default taskSlice.reducer;