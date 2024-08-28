import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, Grid, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import CheckIcon from '@mui/icons-material/Check';
import styled from 'styled-components';

const ModalBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 940px;
  background-color: white;
  border-radius: 16px;
  padding: 0 24px 20px 24px;
`;

const EditButton = styled.h2`
  width: 892px;
  height: 76px;
  display: flex;
  font-weight: 600;
  line-height: 28px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #002E47;
  align-items: center;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const StyledTypography = styled.p`
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

const LinksBox = styled.div`
  border: 1px solid #bdbdbd;
  border-radius: 8px;
  height: 128px;
  padding: 16px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; // Ensure the container takes full height of its parent
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChangeIconText = styled.p`
  width: 61px;
  height: 16px;
  font-size: 10px;
  font-weight: 500;
  line-height: 15.75px;
  color: #637381;
  font-family: sans-serif;
  text-align: center;
`;

const StyledTextField = styled(TextField)`
  && {
    border-radius: 20px;
    margin-left: 10px;
    margin-bottom: 5px;
    margin-right: 10px;
    width: 780px;
    height: 44px;
  }
`;

const ColorButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const StyledColorButton = styled(IconButton)`
  && {
    width: ${props => props.selected ? '26px' : '18px'};
    height: ${props => props.selected ? '26px' : '18px'};
    min-width: 18px;
    border-radius: 50%;
    background-color: ${props => props.color};
    margin: 5px;
    border: ${props => props.color === '#ffffff' ? '1px solid #000' : props.selected ? '0px solid #333' : 'none'};
    margin-top: ${props => props.selected ? '0' : '3px'};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  margin-top: 10px;
  text-transform: capitalize;
`;

const CancelButton = styled(Button)`
  && {
    border: 1px solid #bdbdbd;
    border-radius: 8px;
    padding: 6px 16px;
    width: 79px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: none;
  }
`;

const SaveButton = styled(Button)`
  && {
    margin-left: 15px;
    border-radius: 8px;
    padding: 6px 16px;
    width: 65px;
    height: 36px;
    background-color: #29D25D;
    justify-content: center;
    text-transform: none;
  }
`;

const ButtonText = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  font-family: 'Inter', sans-serif;
  color: ${props => props.color};
`;

const EmailModal = ({ open, onClose, currentEmailData, onSave, onChange }) => {
  const [backgroundColor, setBackgroundColor] = useState(currentEmailData.backgroundColor || '#ffffff');
  const [textColor, setTextColor] = useState(currentEmailData.textColor || '#000000');

  const colors = ['#ffffff', '#002E47', '#015FFB', '#29D25D', '#00B8D9', '#003768', '#FFAB00', '#FFAC82', '#EB2B2E', '#637381', '#919EAB', '#F4F6F8'];

  useEffect(() => {
    setBackgroundColor(currentEmailData.backgroundColor || '#ffffff');
    setTextColor(currentEmailData.textColor || '#000000');
  }, [currentEmailData]);

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
    onChange('backgroundColor', color);
  };

  const handleTextColorChange = (color) => {
    setTextColor(color);
    onChange('textColor', color);
  };

  const ColorButton = ({ color, selected, onClick }) => (
    <StyledColorButton
      size="small"
      onClick={onClick}
      color={color}
      selected={selected}
    >
      {selected && <CheckIcon style={{ width: "16px", height: "16px", color: color === '#ffffff' ? '#000000' : '#ffffff' }} />}
    </StyledColorButton>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <ModalBox>
        <EditButton>Edit Button</EditButton>
        <StyledTypography>Links</StyledTypography>
        <StyledTypography>
          You can add social media links or other links to the collection content.
        </StyledTypography>
        <LinksBox>
          <Grid container spacing={1}>
            <Grid item xs={1}>
              <IconContainer>
                <IconWrapper>
                  <IconButton
                    size="small"
                    variant="outlined"
                    style={{ borderRadius: '10%', border: '1px solid #ddd', marginBottom: '8px' }}
                  >
                    <Icon icon="arcticons:mail" width="24" height="24" style={{ color: 'black' }} />
                  </IconButton>
                  <ChangeIconText>Change Icon</ChangeIconText>
                </IconWrapper>
              </IconContainer>
            </Grid>
            <Grid item xs={11}>
              <StyledTextField
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
              <StyledTextField
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
        </LinksBox>
        <StyledTypography>Background Color</StyledTypography>
        <ColorButtonContainer>
          {colors.map((color) => (
            <ColorButton
              key={`bg-${color}`}
              color={color}
              selected={backgroundColor === color}
              onClick={() => handleBackgroundColorChange(color)}
            />
          ))}
        </ColorButtonContainer>
        <StyledTypography>Text Color</StyledTypography>
        <ColorButtonContainer>
          {colors.map((color) => (
            <ColorButton
              key={`text-${color}`}
              color={color}
              selected={textColor === color}
              onClick={() => handleTextColorChange(color)}
            />
          ))}
        </ColorButtonContainer>
        <ButtonContainer>
          <CancelButton variant="outlined" onClick={onClose}>
            <ButtonText color="#637381">Cancel</ButtonText>
          </CancelButton>
          <SaveButton variant="contained" onClick={onSave}>
            <ButtonText color="#ffffff">Save</ButtonText>
          </SaveButton>
        </ButtonContainer>
      </ModalBox>
    </Modal>
  );
};

export default EmailModal;