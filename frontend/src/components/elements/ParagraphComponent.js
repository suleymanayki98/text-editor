// components/ParagraphComponent.js
import React from 'react';
import styled from 'styled-components';
import { Typography, TextField } from '@mui/material';

const EditableComponent = styled.div`
  position: relative;
  ${props => !props.isEditing && `
    border: 1px solid transparent;
    &:hover {
      border: 1px dashed #a0aec0;
    }
  `}
  padding: 0.5rem;
`;

const StyledTypography = styled(Typography)`
  padding: 0.25rem;
  border: none;
  box-shadow: none;
  white-space: pre-wrap;
  ${props => props.isEditing && 'display: none;'}
`;

const StyledTextField = styled(TextField)`
  position: absolute;
  inset: 0;
  background-color: transparent;
  border: none;
  .MuiInputBase-root {
    background-color: transparent;
  }
`;

const ParagraphComponent = ({ component, section, index, columnIndex, editingIndex, setEditingIndex, handleTextChange }) => {
  const isEditing = editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex;

  return (
    <EditableComponent isEditing={isEditing}>
      <StyledTypography
        variant="body1"
        onClick={() => setEditingIndex({ section, index, columnIndex })}
        isEditing={isEditing}
      >
        {component.text || 'This is a paragraph.'}
      </StyledTypography>
      {isEditing && (
        <StyledTextField
          fullWidth
          multiline
          value={component.text || ''}
          onChange={(e) => handleTextChange(e, section, index, columnIndex)}
          onBlur={() => setEditingIndex({ section: null, index: null, columnIndex: null })}
          autoFocus
        />
      )}
    </EditableComponent>
  );
};

export default ParagraphComponent;