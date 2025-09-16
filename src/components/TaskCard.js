import React from 'react';
import { Card, CardContent, CardActions, Typography, Chip, Box, IconButton, Tooltip, Grid, CircularProgress } from '@mui/material'; // Added Grid, CircularProgress
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTasks } from '../context/TaskContext';
import { format, parseISO } from 'date-fns';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) { 
    case 'todo': return 'default';
    case 'in progress': return 'primary';
    case 'done': return 'success';
    default: return 'info'; 
  }
};

const getPriorityChipProps = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'high': return { label: 'High', color: 'error' };
        case 'medium': return { label: 'Medium', color: 'warning' };
        case 'low': return { label: 'Low', color: 'success' }; // Or 'info' or 'default'
        default: return { label: priority || 'N/A', color: 'default' };
    }
};


function TaskCard({ task, onEdit, onDelete, setSnackbar }) {
  const { deleteTask, loadingTasks: contextLoading } = useTasks();
  const [isDeleting, setIsDeleting] = React.useState(false);


  const handleDelete = async () => {
    onDelete(task);
    if (window.confirm(`Are you sure you want to delete task: "${task.title}"?`)) {
      setIsDeleting(true);
      try {
        await deleteTask(task._id);
        setSnackbar({ 
          open: true, 
          message: 'Task deleted successfully!', 
          severity: 'success' });
      } catch (error) {
        console.error("Failed to delete task:", error);
         setSnackbar({
          open: true,
          message: error.message || "Failed to delete task.",
          severity: 'error'
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formattedDueDate = task.dueDate
    ? format(parseISO(task.dueDate), 'MMM dd, yyyy') // Example: Jan 01, 2024
    : 'No due date';

  const priorityChip = getPriorityChipProps(task.priority);

  return (
    <Card sx={{ mb: 2, opacity: isDeleting ? 0.5 : 1 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word', mr: 1 }}>
            {task.title}
          </Typography>
          <Chip label={task.status || 'N/A'} color={getStatusColor(task.status)} size="small" />
        </Box>

        {task.description && (
          <Typography sx={{ mt: 0.5, mb: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} color="text.secondary">
            {task.description}
          </Typography>
        )}

        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item>
                <Chip {...priorityChip} size="small" />
            </Grid>
            {task.dueDate && (
                <Grid item>
                     <Typography variant="body2" color="text.secondary">
                        Due: {formattedDueDate}
                     </Typography>
                </Grid>
            )}
        </Grid>


        {task.assigneeEmail && (
          <Typography variant="caption" display="block" color="text.secondary">
            Assignee: {task.assigneeEmail}
          </Typography>
        )}
        {task.creatorEmail && (
           <Typography variant="caption" display="block" color="text.secondary" sx={{mt: 0.5}}>
             Created by: {task.creatorEmail}
           </Typography>
        )}
         <Typography variant="caption" display="block" color="text.secondary" sx={{mt: 0.5}}>
            Created: {task.createdAt ? format(parseISO(task.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
         </Typography>
         {task.updatedAt && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{mt: 0.5}}>
                Last Updated: {format(parseISO(task.updatedAt), 'MMM dd, yyyy HH:mm')}
            </Typography>
         )}

      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Edit Task">
          <IconButton 
          size="small" 
          color="primary" 
          onClick={() => onEdit(task)} 
          disabled={isDeleting || contextLoading}>
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Task">
          <IconButton 
          size="small" 
          color="error" 
          onClick={handleDelete} 
          disabled={isDeleting || contextLoading}>
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          </IconButton>
        </Tooltip>
        
      </CardActions>
    </Card>
  );
}

export default TaskCard;