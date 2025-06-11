import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box, CircularProgress, Grid,
  AppBar, Toolbar, IconButton, Alert, Snackbar, Select, MenuItem, 
  FormControl, InputLabel, Tooltip 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import { Link as RouterLink } from 'react-router-dom'; 



const TASK_STATUSES_FOR_FILTER = ['All', 'Todo', 'In Progress', 'Done'];

function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const {
    tasks,
    loadingTasks,
    error: taskError, 
    addTask,
    updateTask,
  } = useTasks();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(''); 

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);

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
      await logout(); 
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      setSnackbar({ open: true, message: 'Logout failed. Please try again.', severity: 'error' });
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
    setFormError('');
  };

  const handleTaskSubmit = async (taskData) => {
    setFormSubmitting(true);
    setFormError('');
    try {
      if (editingTask && editingTask.id) {
        await updateTask(editingTask.id, taskData);
        setSnackbar({ open: true, message: 'Task updated successfully!', severity: 'success' });
      } else {
        await addTask(taskData);
        setSnackbar({ open: true, message: 'Task added successfully!', severity: 'success' });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save task:', error);
      setFormError(error.message || 'Failed to save task. Please try again.');
    }
    setFormSubmitting(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          {currentUser && <Typography sx={{ mr: 2 }}>{currentUser.name || currentUser.email}
            </Typography>}
            <Tooltip title="Profile & Settings">
              <IconButton color="inherit" component={RouterLink} to="/profile">
                  <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: '#A0C878' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, sm: 0 } }}>
            My Tasks
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {TASK_STATUSES_FOR_FILTER.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
            >
              Add Task
            </Button>
          </Box>
        </Box>

        {loadingTasks && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {!loadingTasks && tasks.length === 0 && (
          <Typography sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
            No tasks found. Click "Add Task" to get started!
          </Typography>
        )}

        {!loadingTasks && tasks.length > 0 && filteredTasks.length === 0 && statusFilter !== 'All' && (
             <Typography sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
                No tasks match the current filter "{statusFilter}".
             </Typography>
        )}

        {!loadingTasks && filteredTasks.length > 0 && (
          <Grid container spacing={3}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <TaskCard 
                task={task} 
                onEdit={() => handleOpenModal(task)} 
                setSnackbar={setSnackbar}/>
              </Grid>
            ))}
          </Grid>
        )}

        
      </Container>

      {isModalOpen && ( 
        <TaskFormModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleTaskSubmit}
            initialTask={editingTask}
            formLoading={formSubmitting}
            serverError={formError} 
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default DashboardPage;