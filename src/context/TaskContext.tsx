import React, { createContext, useContext, useReducer, useEffect } from "react";
import * as SQLite from "expo-sqlite";

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
  reminder: boolean;
  isRecurring: boolean;
  recurringDays: number[]; // Array of day numbers (0 = Sunday, 1 = Monday, etc.)
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: string };

const TaskContext = createContext<
  | {
      state: TaskState;
      dispatch: React.Dispatch<TaskAction>;
      addTask: (
        task: Omit<Task, "id" | "createdAt" | "updatedAt">
      ) => Promise<void>;
      updateTask: (task: Task) => Promise<void>;
      deleteTask: (id: string) => Promise<void>;
      toggleTask: (id: string) => Promise<void>;
      getTasksByDate: (date: string) => Task[];
    }
  | undefined
>(undefined);

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    default:
      return state;
  }
};

// ✅ Open database once
let db: SQLite.SQLiteDatabase;

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    (async () => {
      db = await SQLite.openDatabaseAsync("tasks.db");
      await initializeDatabase();
      await loadTasks();
    })();
  }, []);

  const initializeDatabase = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          priority TEXT NOT NULL,
          category TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          reminder INTEGER DEFAULT 1,
          isRecurring INTEGER DEFAULT 0,
          recurringDays TEXT DEFAULT '[]',
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const loadTasks = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const rows = await db.getAllAsync<any>(
        "SELECT * FROM tasks ORDER BY date ASC, time ASC"
      );
      const tasks = rows.map((task) => ({
        ...task,
        completed: Boolean(task.completed),
        reminder: Boolean(task.reminder),
        isRecurring: Boolean(task.isRecurring),
        recurringDays: task.recurringDays ? JSON.parse(task.recurringDays) : [],
      }));
      dispatch({ type: "SET_TASKS", payload: tasks });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const task: Task = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db.runAsync(
        `INSERT INTO tasks (id, title, description, date, time, priority, category, completed, reminder, isRecurring, recurringDays, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.id,
          task.title,
          task.description,
          task.date,
          task.time,
          task.priority,
          task.category,
          task.completed ? 1 : 0,
          task.reminder ? 1 : 0,
          task.isRecurring ? 1 : 0,
          JSON.stringify(task.recurringDays),
          task.createdAt,
          task.updatedAt,
        ]
      );
      dispatch({ type: "ADD_TASK", payload: task });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const updateTask = async (task: Task) => {
    const updatedTask = { ...task, updatedAt: new Date().toISOString() };
    try {
      await db.runAsync(
        `UPDATE tasks 
         SET title = ?, description = ?, date = ?, time = ?, priority = ?, category = ?, completed = ?, reminder = ?, isRecurring = ?, recurringDays = ?, updatedAt = ?
         WHERE id = ?`,
        [
          updatedTask.title,
          updatedTask.description,
          updatedTask.date,
          updatedTask.time,
          updatedTask.priority,
          updatedTask.category,
          updatedTask.completed ? 1 : 0,
          updatedTask.reminder ? 1 : 0,
          updatedTask.isRecurring ? 1 : 0,
          JSON.stringify(updatedTask.recurringDays),
          updatedTask.updatedAt,
          updatedTask.id,
        ]
      );
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const toggleTask = async (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await updateTask(updatedTask);
    }
  };

  const getTasksByDate = (date: string): Task[] => {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    return state.tasks.filter((task) => {
      // Include tasks for the exact date
      if (task.date === date) {
        return true;
      }

      // Include recurring tasks that match the day of week
      if (task.isRecurring && task.recurringDays.includes(dayOfWeek)) {
        return true;
      }

      return false;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        dispatch,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        getTasksByDate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
