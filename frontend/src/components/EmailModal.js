import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Grid, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import CheckIcon from '@mui/icons-material/Check';

const EmailModal = ({ open, onClose, currentEmailData, onSave, onChange }) => {
  const [backgroundColor, setBackgroundColor] = useState(currentEmailData.backgroundColor || '#ffffff');
  const [textColor, setTextColor] = useState(currentEmailData.textColor || '#000000');

  const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
    onChange('backgroundColor', color);
  };

  const handleTextColorChange = (color) => {
    setTextColor(color);
    onChange('textColor', color);
  };

  const ColorButton = ({ color, selected, onClick }) => (
    <Button
      onClick={onClick}
      style={{
        width: selected ? 35 : 30,
        height: selected ? 35 : 30,
        minWidth: 30,
        borderRadius: '50%',
        backgroundColor: color,
        margin: 5,
        border: color === '#ffffff' ? '2px solid #000' : selected ? '2px solid #333' : 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {selected && <CheckIcon style={{ color: color === '#ffffff' ? '#000000' : '#ffffff' }} />}
    </Button>
  );

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
                InputProps={{
                  style: { color: textColor }
                }}
              />
              <TextField
                style={{ borderRadius: '10px', margin: '10px' }}
                label="Email"
                fullWidth
                variant="outlined"
                value={currentEmailData.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                InputProps={{
                  style: { color: textColor }
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <h4>Background Color</h4>
          <Box display="flex" flexWrap="wrap">
            {colors.map((color) => (
              <ColorButton
                key={`bg-${color}`}
                color={color}
                style={{
                  border: '1px dashed #000',
                }}
                selected={backgroundColor === color}
                onClick={() => handleBackgroundColorChange(color)}
              />
            ))}
          </Box>
          <h4>Text Color</h4>
          <Box display="flex" flexWrap="wrap">
            {colors.map((color) => (
              <ColorButton
                key={`text-${color}`}
                color={color}
                selected={textColor === color}
                onClick={() => handleTextColorChange(color)}
              />
            ))}
          </Box>
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