import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Button, Box, CircularProgress, Grid, Paper,
  AppBar, Toolbar, IconButton, Alert, Snackbar, Select, MenuItem, FormControl, InputLabel, Tooltip
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import ConfirmationDialog from '../components/ConfirmationDialog';


const TASK_STATUSES_FOR_FILTER = ['All', 'Todo', 'In Progress', 'Done'];

function DashboardPage() {

  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);

  
  const tasksByStatus = {
    Todo: filteredTasks.filter(task => task.status === 'Todo'),
    'In Progress': filteredTasks.filter(task => task.status === 'In Progress'),
    Done: filteredTasks.filter(task => task.status === 'Done'),
  };
  const statuses = ['Todo', 'In Progress', 'Done'];
  const { currentUser, logout } = useAuth();
  const {
    tasks, loadingTasks, error: taskError, addTask, deleteTask, updateTask,
  } = useTasks();
  const navigate = useNavigate();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  

  useEffect(() => {
    if (taskError) {
      setSnackbar({ open: true, message: taskError, severity: 'error' });
    }
  }, [taskError]);

  useEffect(() => {
    let currentTasks = tasks;
    if (statusFilter !== 'All') {
      currentTasks = tasks.filter(task => task.status === statusFilter);
    }
    setFilteredTasks(currentTasks);
  }, [tasks, statusFilter]);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = async (taskData) => {
    setFormSubmitting(true);
    setFormError('');
    try {
      if (editingTask && editingTask._id) {
        await updateTask(editingTask._id, taskData);
        setSnackbar({ open: true, message: 'Task updated successfully!', severity: 'success' });
      } else {
        await addTask(taskData);
        setSnackbar({ open: true, message: 'Task added successfully!', severity: 'success' });
      }
      handleCloseModal();
    } catch (error) {
      setFormError(error.message || 'Failed to save task.');
    }
    setFormSubmitting(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };


  const handleOpenConfirmDialog = (task) => {
    setTaskToDelete(task);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setTaskToDelete(null);
    setConfirmDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete._id);
        setSnackbar({ open: true, message: 'Task deleted successfully!', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: error.message || 'Failed to delete task.', severity: 'error' });
      } finally {
        handleCloseConfirmDialog(); // Close the dialog whether it succeeds or fails
      }
    }
  };
  
  // In src/pages/DashboardPage.js, replace your entire `return (...)` block:

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Task Manager</Typography>
          {currentUser && <Typography sx={{ mr: 2 }}>{currentUser.name || currentUser.email}</Typography>}
          <Tooltip title="Profile & Settings">
            <IconButton color="inherit" component={RouterLink} to="/profile"><AccountCircleIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}><LogoutIcon /></IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Changed to maxWidth="xl" for more space for the columns */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, sm: 0 } }}>My Tasks</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select value={statusFilter} label="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
                {TASK_STATUSES_FOR_FILTER.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add Task</Button>
          </Box>
        </Box>

        {loadingTasks && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
        )}
        {!loadingTasks && tasks.length === 0 && (
          <Typography sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>No tasks found. Click "Add Task" to get started!</Typography>
        )}
        {!loadingTasks && tasks.length > 0 && filteredTasks.length === 0 && statusFilter !== 'All' && (
             <Typography sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>No tasks match the filter "{statusFilter}".</Typography>
        )}

        {/* --- REPLACED GRID WITH KANBAN-STYLE COLUMN LAYOUT --- */}
        {!loadingTasks && filteredTasks.length > 0 && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {statuses.map((status) => (
              // Each column takes 1/3 of the width on medium screens and up
              <Grid item xs={12} md={4} key={status}>
                <Paper elevation={2} sx={{ p: 2, backgroundColor: 'grey.100', height: '100%', borderRadius: '12px' }}>
                  <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {status} ({tasksByStatus[status].length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tasksByStatus[status].length > 0 ? (
                      tasksByStatus[status].map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={() => handleOpenModal(task)}
                          onDelete={handleOpenConfirmDialog}
                          setSnackbar={setSnackbar}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 2, fontStyle: 'italic' }}>
                        No tasks in this category.
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        {/* --- END OF KANBAN-STYLE LAYOUT --- */}
      </Container>
      
      {/* Modals and Snackbar remain the same */}
      {isModalOpen && (
        <TaskFormModal
            open={isModalOpen} onClose={handleCloseModal} onSubmit={handleTaskSubmit}
            initialTask={editingTask} formLoading={formSubmitting} serverError={formError}
        />
      )}

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently delete the task: "${taskToDelete?.title}"? This action cannot be undone.`}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default DashboardPage;