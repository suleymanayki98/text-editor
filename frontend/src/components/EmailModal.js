// EmailModal.js
import React from 'react';
import { Modal, Box, TextField, Button, Grid, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';

const EmailModal = ({ open, onClose, currentEmailData, onSave, onChange }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          borderRadius: '16px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          p: 3,
        }}
      >
        <h3 id="modal-title">Edit Button</h3>
        <h4>Links</h4>
        <p>You can add social media links or other links to the collection content.</p>
        <Box sx={{
          border: '1px solid',
          borderColor: 'grey.400',
          borderRadius: '8px',
          padding: 10,
          p: 2,
        }}>
          <Grid container spacing={2}>
            <Grid item xs={2} container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
              <IconButton
                size="small"
                variant="outlined"
                style={{ borderRadius: '10%', border: '1px solid #ddd', marginTop: '15px' }}
              >
                <Icon icon="arcticons:mail" width="24" height="24" style={{ color: 'black' }} />
              </IconButton>
              <p>Change Icon</p>
            </Grid>
            <Grid item xs={10}>
              <TextField
                style={{ borderRadius: '20px', margin: '10px' }}
                label="Button Text"
                fullWidth
                variant="outlined"
                value={currentEmailData.buttonText || ''}
                onChange={(e) => onChange('buttonText', e.target.value)}
              />
              <TextField
                style={{ borderRadius: '10px', margin: '10px' }}
                label="Email"
                fullWidth
                variant="outlined"
                value={currentEmailData.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" justifyContent="flex-end" style={{ flexGrow: 1, marginTop: '25px', textTransform: 'capitalize', }}>
          <Button variant="outlined" onClick={onClose}>Close</Button>
          <Button style={{
            marginLeft: '15px',
          }} variant="contained" color="success" onClick={onSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmailModal;  