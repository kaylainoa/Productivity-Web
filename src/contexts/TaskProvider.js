import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create a context for tasks
const TaskContext = createContext();

// Initial state for the tasks
const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Actions
const ADD_TASK = 'ADD_TASK';
const REMOVE_TASK = 'REMOVE_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const SET_TASKS = 'SET_TASKS';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

// Reducer function to handle state updates
const taskReducer = (state, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    case SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

// TaskProvider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        dispatch({ type: SET_TASKS, payload: JSON.parse(storedTasks) });
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [state.tasks]);

  // Actions
  const addTask = (task) => {
    dispatch({
      type: ADD_TASK,
      payload: { ...task, id: Date.now().toString() },
    });
  };

  const removeTask = (taskId) => {
    dispatch({
      type: REMOVE_TASK,
      payload: taskId,
    });
  };

  const updateTask = (task) => {
    dispatch({
      type: UPDATE_TASK,
      payload: task,
    });
  };

  const setTasks = (tasks) => {
    dispatch({
      type: SET_TASKS,
      payload: tasks,
    });
  };

  const setLoading = (isLoading) => {
    dispatch({
      type: SET_LOADING,
      payload: isLoading,
    });
  };

  const setError = (error) => {
    dispatch({
      type: SET_ERROR,
      payload: error,
    });
  };

  // Value object with state and actions
  const value = {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    addTask,
    removeTask,
    updateTask,
    setTasks,
    setLoading,
    setError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use the task context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskProvider;