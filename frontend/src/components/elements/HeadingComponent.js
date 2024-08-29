import React from 'react';
import styled from 'styled-components';

const HeadingWrapper = styled.div`
  position: relative;
`;

const EditableHeading = styled.div`
  font-size: ${props => props.isH1 ? '2.25rem' : '1.875rem'};
  font-weight: bold;
  line-height: 1.2;
  margin: 0;
  padding: 0.25rem;
  border: 1px solid #d1d5db;
  outline: none;
`;

const StyledHeading = styled(({ isH1, ...props }) => 
  isH1 ? <h1 {...props} /> : <h2 {...props} />
)`
  font-size: ${props => props.isH1 ? '2.25rem' : '1.875rem'};
  font-weight: bold;
  line-height: 1.2;
  margin: 0;
  padding: 0.25rem;
  border: none;
  box-shadow: none;
  white-space: pre-wrap;
`;

const HeadingComponent = ({ component, section, index, columnIndex, editingIndex, setEditingIndex, handleTextChange }) => {
  const isEditing = editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex;
  const isH1 = component.type === 'h1';

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
          isH1={isH1}
        >
          {component.text || 'Heading 1'}
        </EditableHeading>
      ) : (
        <StyledHeading
          onClick={() => setEditingIndex({ section, index, columnIndex })}
          isH1={isH1}
        >
          {component.text || 'Heading 1'}
        </StyledHeading>
      )}
    </HeadingWrapper>
  );
};

export default HeadingComponent;