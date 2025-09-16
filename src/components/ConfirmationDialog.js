import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title || "Confirm Action"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message || "Are you sure you want to proceed?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;