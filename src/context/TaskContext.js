import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; 
import { fetchTasks as apiFetchTasks, createTask as apiCreateTask, updateTaskById as apiUpdateTask, deleteTaskById as apiDeleteTask } from '../api'; // Import your API functions

const TaskContext = createContext();

export function useTasks() {
  return useContext(TaskContext);
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null); 
  const { isAuthenticated, currentUser } = useAuth(); 

  // Fetch tasks when component mounts or user becomes authenticated
  const loadTasks = useCallback(async () => {
    if (!isAuthenticated || !currentUser) {
      setTasks([]); 
      setLoadingTasks(false);
      return;
    }

    setLoadingTasks(true);
    setError(null);
    try {
      const response = await apiFetchTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.msg || 'Failed to fetch tasks' : err.message);
      setTasks([]); 
    } finally {
      setLoadingTasks(false);
    }
  }, [isAuthenticated, currentUser]); 

  useEffect(() => {
    loadTasks();
  }, [loadTasks]); // loadTasks is stable due to useCallback

  const addTask = async (taskData) => {
    if (!isAuthenticated) throw new Error("User not authenticated");
    setError(null);
    try {
      // The backend assigns userId, creatorEmail, createdAt, id
      const response = await apiCreateTask(taskData);
      setTasks(prevTasks => [...prevTasks, response.data]); 
      return response.data;
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg || 'Failed to add task' : err.message;
      setError(errorMsg);
      throw new Error(errorMsg); 
    }
  };

  const updateTask = async (taskId, updatedData) => {
    if (!isAuthenticated) throw new Error("User not authenticated");
    setError(null);
    try {
      const response = await apiUpdateTask(taskId, updatedData);
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? response.data : task))
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg || 'Failed to update task' : err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

const deleteTask = async (taskId) => { 
  if (!isAuthenticated) throw new Error("User not authenticated");
  setError(null);
  try {
    console.log("TaskContext: deleteTask - Attempting to delete task with ID:", taskId);
    await apiDeleteTask(taskId); 

    setTasks(prevTasks => {
      console.log("TaskContext: deleteTask - taskId to remove from local state:", taskId);
      console.log("TaskContext: deleteTask - prevTasks (IDs only):", JSON.stringify(prevTasks.map(t => t._id)));

    
      const newTasks = prevTasks.filter(task => task._id !== taskId);
  

      console.log("TaskContext: deleteTask - newTasks (IDs only):", JSON.stringify(newTasks.map(t => t._id)));
      console.log("TaskContext: deleteTask - Was a task removed from local state?", prevTasks.length !== newTasks.length);
      return newTasks;
    });

  } catch (err) {
    console.error("Error deleting task in TaskContext:", err.response ? err.response.data : err.message);
    const errorMsg = err.response ? err.response.data.msg || 'Failed to delete task' : err.message;
    setError(errorMsg);
    throw new Error(errorMsg);
  }
};

  const value = {
    tasks,
    loadingTasks,
    error, 
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks 
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}