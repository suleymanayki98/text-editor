import React from 'react';
import styled from 'styled-components';

// Styled components
const EditorContainer = styled.div`
  position: relative;
  font-family: 'Courier New', monospace;
  white-space: pre;
  overflow: auto;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 400px;
  font-family: 'Courier New', monospace;
  line-height: 1.5em;
  padding-left: 40px;
  border: none;
  outline: none;
  &:hover {
    border: none;
  }
  &:focus {
    border: none;
    box-shadow: none;
  }
`;

const LineNumbers = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  user-select: none;
  width: 24px;
  background-color: #fff;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 8px;
  padding-top: 12px;
`;

const LineNumber = styled.div`
  color: #999;
  line-height: 1.5em;
`;

const SourceCodeEditor = ({ value, onChange }) => {
  const lines = value.split('\n');

  return (
    <EditorContainer>
      <TextArea
        value={value}
        onChange={onChange}
      />
      <LineNumbers>
        {lines.map((_, index) => (
          <LineNumber key={index}>
            {index + 1}
          </LineNumber>
        ))}
      </LineNumbers>
    </EditorContainer>
  );
};

export default SourceCodeEditor;
