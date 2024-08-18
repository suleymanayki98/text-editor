import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Grid, IconButton, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import CheckIcon from '@mui/icons-material/Check';

const EmailModal = ({ open, onClose, currentEmailData, onSave, onChange }) => {
  const [backgroundColor, setBackgroundColor] = useState(currentEmailData.backgroundColor || '#ffffff');
  const [textColor, setTextColor] = useState(currentEmailData.textColor || '#000000');

  const colors = ['#ffffff', '#002E47', '#015FFB', '#29D25D', '#00B8D9', '#003768', '#FFAB00', '#FFAC82', '#EB2B2E', '#637381', '#919EAB', '#F4F6F8'];

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
    onChange('backgroundColor', color);
  };

  const handleTextColorChange = (color) => {
    setTextColor(color);
    onChange('textColor', color);
  };

  const ColorButton = ({ color, selected, onClick }) => (
    <IconButton
      size="small"
      onClick={onClick}
      style={{
        width: selected ? 26 : 18,
        height: selected ? 26 : 18,
        minWidth: 18,
        borderRadius: '50%',
        backgroundColor: color,
        margin: 5,
        border: color === '#ffffff' ? '2px solid #000' : selected ? '2px solid #333' : 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5px'
      }}
    >
      {selected && <CheckIcon icon="material-symbols:check" style={{ width: "16px", height: "16px", color: color === '#ffffff' ? '#000000' : '#ffffff' }} />}
    </IconButton>
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
          width: 940,
          bgcolor: 'background.paper',
          p: 3,
        }}
      >
        <Typography style={{
          width: '892px',
          height: '28px',
          display: 'flex',
          fontWeight: 600,
          lineHeight: '28px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          color: '#002E47',
          alignItems: 'left',
          marginBottom: '20px',
          textTransform: 'capitalize',
        }}>
          Edit Button
        </Typography>
        <Typography style={{
          width: '892px',
          height: '20px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          lineHeight: '28px',
          color: '#002E47',
        }}>
          Links
        </Typography>
        <Typography style={{
          width: '892px',
          height: '22px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          lineHeight: '22px',
          marginTop: '10px',
          marginBottom: '10px',
          color: '#637381',
        }}>
          You can add social media links or other links to the collection content.
        </Typography>
        <Box sx={{
          border: '1px solid',
          borderColor: 'grey.400',
          borderRadius: '8px',
          height: '128px',
          p: 2,
        }}>
          <Grid container spacing={1}>
            <Grid
              item
              xs={1}
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              style={{ height: '17vh' }}  // Yüksekliği ekran yüksekliği olarak ayarlayın veya ihtiyaca göre değiştirin
            >
              <IconButton
                size="small"
                variant="outlined"
                style={{ borderRadius: '10%', border: '1px solid #ddd', marginBottom: '8px' }}
              >
                <Icon icon="arcticons:mail" width="24" height="24" style={{ color: 'black' }} />
              </IconButton>
              <Typography
                style={{
                  width: '61px',
                  height: '16px',
                  fontSize: '10px',
                  fontWeight: 500,
                  lineHeight: '15.75px',
                  color: '#637381',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center'
                }}
              >
                Change Icon
              </Typography>
            </Grid>

            <Grid item xs={11}>
              <TextField
                style={{
                  borderRadius: '20px', marginLeft: '10px', marginBottom: '5px', marginRight: '10px', width: '780px',
                  height: '44px',
                }}
                label="Contact me"
                fullWidth
                size="small"
                variant="outlined"
                value={currentEmailData.buttonText || ''}
                onChange={(e) => onChange('buttonText', e.target.value)}
                InputProps={{
                  style: { color: textColor }
                }}
              />
              <TextField
                style={{
                  borderRadius: '20px', marginLeft: '10px', marginRight: '10px', width: '780px',
                  height: '44px',
                }}
                label="Email"
                fullWidth
                size="small"
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
          <Typography style={{
            width: '892px',
            height: '20px',
            fontWeight: 500,
            lineHeight: '20px',
            fontSize: '14px',
            color: '#637381',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '10px',
          }}>
            Background Color
          </Typography>
          <Box display="flex" flexWrap="wrap" style={{
            marginBottom: '10px',
          }}>
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
          <Typography style={{
            width: '892px',
            height: '20px',
            fontWeight: 500,
            lineHeight: '20px',
            fontSize: '14px',
            color: '#637381',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '10px',
          }}>
            Text Color
          </Typography>
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
        <Box display="flex" justifyContent="flex-end" style={{ flexGrow: 1, marginTop: '10px', textTransform: 'capitalize', }}>
          <Button
            variant="outlined"
            style={{
              border: '1px solid #919EAB',
              borderRadius: '8px',
              padding: '6px 16px',
              width: '79px',
              height: '36px',
              justifyContent: 'center',
              textTransform: 'none',
            }}
            onClick={onClose}
          >
            <Typography style={{
            fontWeight: 500,
            lineHeight: '24px',
            fontSize: '14px',
            color: '#637381',
            fontFamily: 'Inter, sans-serif',
          }}>
            Cancel
          </Typography>
          </Button>
          <Button style={{
            marginLeft: '15px',
              borderRadius: '8px',
              padding: '6px 16px',
              width: '65px',
              height: '36px',
              backgroundColor: '#29D25D',
              justifyContent: 'center',
              textTransform: 'none',
          }} variant="contained"  onClick={onSave}>
            
            <Typography style={{
            fontWeight: 500,
            lineHeight: '24px',
            fontSize: '14px',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
          }}>
            Save
          </Typography>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmailModal;