// src/context/TaskContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchTasks, createTask, updateTaskById, deleteTaskById } from '../api';

const TaskContext = createContext();

export function useTasks() {
  return useContext(TaskContext);
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const loadTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      setLoadingTasks(false);
      return;
    }
    setLoadingTasks(true);
    setError(null);
    try {
      const response = await fetchTasks();
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.response?.data?.msg || 'Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (taskData) => {
    if (!isAuthenticated) throw new Error("User not authenticated");
    setError(null);
    try {
      const response = await createTask(taskData);
      setTasks(prevTasks => [...prevTasks, response.data]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to add task';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    if (!isAuthenticated) throw new Error("User not authenticated");
    setError(null);
    try {
      const response = await updateTaskById(taskId, updatedData);
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === taskId ? response.data : task))
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to update task';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteTask = async (taskId) => {
    if (!isAuthenticated) throw new Error("User not authenticated");
    setError(null);
    try {
      await deleteTaskById(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to delete task';
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
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}