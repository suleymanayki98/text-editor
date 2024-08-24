import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Grid, IconButton, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import CheckIcon from '@mui/icons-material/Check';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  width: 892px;
  height: 20px;
  font-weight: 500;
  line-height: 20px;
  font-size: 14px;
  color: #637381;
  font-family: 'Inter', sans-serif;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const EditButton = styled(Typography)`
  width: 892px;
  height: 76px;
  display: flex;
  font-weight: 600;
  line-height: 28px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #002E47;
  align-items: center; /* 'left' is not valid here, use 'flex-start' */
  margin-bottom: 10px;
  text-transform: capitalize;
`;

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
        border: color === '#ffffff' ? '1px solid #000' : selected ? '0px solid #333' : 'none',
        marginTop: selected ? '0' : '3px'
      }}
      className="items-center flex justify-center"
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
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl w-[940px] bg-white px-6 pb-5"
      >
        <EditButton>Edit Button</EditButton>
        <Typography className="w-[892px] h-[20px] text-sm font-medium leading-[20px] text-custom-dark font-sans">
          Links
        </Typography>
        <StyledTypography >
          You can add social media links or other links to the collection content.
        </StyledTypography>
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
              alignItems="center"// Yüksekliği ekran yüksekliği olarak ayarlayın veya ihtiyaca göre değiştirin
            >
              <IconButton
                size="small"
                variant="outlined"
                style={{ borderRadius: '10%', border: '1px solid #ddd', marginBottom: '8px' }}
              >
                <Icon icon="arcticons:mail" width="24" height="24" style={{ color: 'black' }} />
              </IconButton>
              <p
                className="w-[61px] h-[16px] text-[10px] font-medium leading-[15.75px] text-[#637381] font-sans text-center"
              >
                Change Icon
              </p>
            </Grid>

            <Grid item xs={11}>
              <TextField
                className="rounded-[20px] ml-[10px] mb-[5px] mr-[10px] w-[780px] h-[44px]"
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
                className="rounded-[20px] ml-[10px] mb-[5px] mr-[10px] w-[780px] h-[44px]"
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
          <StyledTypography>Background Color</StyledTypography>
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
          <StyledTypography>Text Color</StyledTypography>
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
            className="border border-custom-gray rounded-lg py-1.5 px-4 w-[79px] h-[36px] flex items-center justify-center text-base normal-case"
            onClick={onClose}
          >
            <p  className="font-medium text-[14px] leading-[24px] text-custom-light-gray font-inter normal-case">
              Cancel
            </p>
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
          }} variant="contained" onClick={onSave}>

            <p className="font-medium text-[14px] leading-[24px] text-custom-white font-inter">
              Save
            </p>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmailModal;