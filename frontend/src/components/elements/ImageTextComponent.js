import React from 'react';
import styled from 'styled-components';
import { Typography, TextField, Button, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageTextWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const ImageContainer = styled.div`
  flex: 1;
  position: relative;
`;

const TextContainer = styled.div`
  flex: 2;
`;

const EditableComponent = styled.div`
  position: relative;
  ${props => !props.isEditing && `
    border: 1px solid transparent;
    &:hover {
      border: 1px dashed #a0aec0;
    }
  `}
  padding: 0.5rem;
  margin-bottom: 1rem;
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

const ImageUploadButton = styled(Button)`
  width: 100%;
  height: 100%;
  min-height: 150px;
  border: 2px dashed #a0aec0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
`;

const ImageTextComponent = ({
  component,
  section,
  index,
  columnIndex,
  editingIndex,
  setEditingIndex,
  handleImageUpload,
  handleParagraphChange,
  addParagraph,
  removeParagraph,
}) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e, section, index, columnIndex);
    }
  };

  return (
    <ImageTextWrapper>
      <ImageContainer>
        {component.imageUrl ? (
          <div style={{ position: 'relative' }}>
            <ImagePreview src={component.imageUrl} alt="Uploaded content" />
            <IconButton
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => handleImageUpload({ target: { files: [] } }, section, index, columnIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : (
          <ImageUploadButton
            component="label"
            variant="outlined"
          >
            <AddPhotoAlternateIcon style={{ fontSize: 48, marginBottom: 8 }} />
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </ImageUploadButton>
        )}
      </ImageContainer>
      <TextContainer>
        {component.paragraphs.map((paragraph, pIndex) => {
          const isEditing = editingIndex.section === section && 
                            editingIndex.index === index && 
                            editingIndex.columnIndex === columnIndex &&
                            editingIndex.paragraphIndex === pIndex;

          return (
            <EditableComponent key={pIndex} isEditing={isEditing}>
              <StyledTypography
                variant="body1"
                onClick={() => setEditingIndex({ section, index, columnIndex, paragraphIndex: pIndex })}
                isEditing={isEditing}
              >
                {paragraph || 'Click to edit this paragraph.'}
              </StyledTypography>
              {isEditing && (
                <StyledTextField
                  fullWidth
                  multiline
                  value={paragraph || ''}
                  onChange={(e) => handleParagraphChange(e, section, index, pIndex, columnIndex)}
                  onBlur={() => setEditingIndex({ section: null, index: null, columnIndex: null, paragraphIndex: null })}
                  autoFocus
                />
              )}
              <IconButton
                size="small"
                onClick={() => removeParagraph(section, index, pIndex, columnIndex)}
                style={{ position: 'absolute', top: 0, right: 0 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </EditableComponent>
          );
        })}
        <Button onClick={() => addParagraph(section, index, columnIndex)} variant="outlined" size="small">
          Add Paragraph
        </Button>
      </TextContainer>
    </ImageTextWrapper>
  );
};

export default ImageTextComponent;