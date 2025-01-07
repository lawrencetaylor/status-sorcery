import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  dueDate: string | null;
  category: string | null;
}

interface CategoryData {
  name: string;
  color: string;
}

interface TaskState {
  tasks: Task[];
  categories: CategoryData[];
}

const initialState: TaskState = {
  tasks: [],
  categories: [
    { name: 'Work', color: '#9b87f5' },
    { name: 'Personal', color: '#F97316' },
    { name: 'Shopping', color: '#0EA5E9' },
    { name: 'Health', color: '#D946EF' }
  ]
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
    addCategory: (state, action: PayloadAction<{ name: string; color: string }>) => {
      if (!state.categories.some(cat => cat.name === action.payload.name)) {
        state.categories.push({ name: action.payload.name, color: action.payload.color });
      }
    },
    updateCategory: (state, action: PayloadAction<{ oldName: string; newName: string; color: string }>) => {
      const index = state.categories.findIndex(cat => cat.name === action.payload.oldName);
      if (index !== -1) {
        state.categories[index] = { name: action.payload.newName, color: action.payload.color };
        // Update all tasks using this category
        state.tasks.forEach(task => {
          if (task.category === action.payload.oldName) {
            task.category = action.payload.newName;
          }
        });
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.name !== action.payload);
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