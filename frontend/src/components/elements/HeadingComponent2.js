import React from 'react';
import styled from 'styled-components';

const HeadingWrapper = styled.div`
  position: relative;
`;

const EditableHeading = styled.div`
  font-size: 1.875rem;
  font-weight: bold;
  line-height: normal;
  margin: 0;
  padding: 0.25rem;
  outline: none;
  border: 1px solid #d1d5db;
`;

const StyledHeading = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  line-height: normal;
  margin: 0;
  padding: 0.25rem;
  border: none;
  box-shadow: none;
  white-space: pre-wrap;
  ${props => props.className}
`;

const HeadingComponent2 = ({ component, section, index, columnIndex, editingIndex, setEditingIndex, handleTextChange }) => {
  const isEditing = editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex;

  return (
    <HeadingWrapper>
      {isEditing ? (
        <EditableHeading
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            handleTextChange({ target: { value: e.target.innerText } }, section, index, columnIndex);
            setEditingIndex({ section: null, index: null, columnIndex: null });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.target.blur();
            }
          }}
        >
          {component.text || 'Heading 2'}
        </EditableHeading>
      ) : (
        <StyledHeading
          onClick={() => setEditingIndex({ section, index, columnIndex })}
          className={component.className}
        >
          {component.text || 'Heading 2'}
        </StyledHeading>
      )}
    </HeadingWrapper>
  );
};

export default HeadingComponent2;