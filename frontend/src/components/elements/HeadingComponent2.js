  // components/HeadingComponent.js
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

const StyledHeading = styled(props => props.isH1 ? 'h1' : 'h2')`
  font-size: ${props => props.isH1 ? '2.25rem' : '1.875rem'};
  font-weight: bold;
  line-height: 1.2;
  margin: 0;
  padding: 0.25rem;
  border: none;
  box-shadow: none;
  white-space: pre-wrap;
`;

const HeadingComponent2 = ({ component, section, index, columnIndex, editingIndex, setEditingIndex, handleTextChange }) => {
  const isEditing = editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex;
  const isH1 = component.type === 'h1';

  return (
    <div className="relative">
    {editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex ? (
      <div
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
        className="text-3xl font-bold leading-normal m-0 p-1 outline-none border border-gray-300"
      >
        {component.text || 'Heading 2'}
      </div>
    ) : (
      <h2
        onClick={() => setEditingIndex({ section, index, columnIndex })}
        className={`${component.className || 'text-3xl font-bold leading-normal m-0'} p-1 border-none shadow-none whitespace-pre-wrap`}
      >
        {component.text || 'Heading 2'}
      </h2>
    )}
  </div>
  );
};

export default HeadingComponent2;