import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Grid, CircularProgress, Alert
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const TASK_STATUSES = ['Todo', 'In Progress', 'Done'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

function TaskFormModal({ open, onClose, onSubmit, initialTask, formLoading, serverError }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
 
  const [dueDate, setDueDate] = useState(null);

  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [localFormError, setLocalFormError] = useState('');

  useEffect(() => {
    if (open) {
      setLocalFormError('');
    }
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'Todo');
      setPriority(initialTask.priority || 'Medium');
     
      if (initialTask.dueDate) {
        try {
          const parsedDate = new Date(initialTask.dueDate);
          if (!isNaN(parsedDate.getTime())) { 
            setDueDate(parsedDate);
          } else {
            setDueDate(null);
          }
        } catch (e) {
          console.warn("Error parsing initial due date:", e);
          setDueDate(null);
        }
      } else {
        setDueDate(null);
      }
      setAssigneeEmail(initialTask.assigneeEmail || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('Todo');
      setPriority('Medium');
      setDueDate(null); // Reset to null for new task
      setAssigneeEmail('');
    }
  }, [initialTask, open]);

  const handleDueDateChange = (newDate) => {
    setDueDate(newDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalFormError('');

    if (!title.trim()) {
      setLocalFormError("Title is required.");
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
    
      dueDate: dueDate ? dueDate.toISOString() : null,
      assigneeEmail: assigneeEmail.trim() || null,
    };
    onSubmit(taskData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{initialTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {localFormError && (
              <Alert severity="warning" sx={{ mb: 2 }}>{localFormError}</Alert>
            )}
            {serverError && !localFormError && (
              <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Title" /* ... */
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={formLoading}
                  error={!!localFormError && !title.trim()}
                  helperText={!!localFormError && !title.trim() ? "Title cannot be empty" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Description" /* ... */
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={formLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense" disabled={formLoading}>
                  <InputLabel>Status</InputLabel>
                  <Select value={status} 
                  label="Status" 
                  onChange={(e) => setStatus(e.target.value)}>
                    {TASK_STATUSES.map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                 <FormControl fullWidth margin="dense" disabled={formLoading}>
                  <InputLabel>Priority</InputLabel>
                  <Select value={priority} 
                  label="Priority" 
                  onChange={(e) => setPriority(e.target.value)}>
                    {TASK_PRIORITIES.map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
              {/* --- DatePicker Implementation --- */}
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={handleDueDateChange}
                  disabled={formLoading}
                  enableAccessibleFieldDOMStructure={false}
                  slots=
                  {{ textField: (params) => <TextField 
                    {...params} fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} /> 
                  }}
                 
                />
              </Grid>
              {/* --- End DatePicker --- */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Assignee Email (Optional)" 
                  value={assigneeEmail}
                  onChange={(e) => setAssigneeEmail(e.target.value)}
                  disabled={formLoading}
                />
              </Grid>
            </Grid>

          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button onClick={onClose} 
            color="secondary" 
            disabled={formLoading}>
              Cancel
              </Button>
            <Button type="submit" 
            variant="contained" 
            color="primary" 
            disabled={formLoading}>
              {formLoading ? <CircularProgress 
              size={24} 
              color="inherit"/> : 
              (initialTask ? 
              'Save Changes' : 'Add Task')
              }
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

export default TaskFormModal;