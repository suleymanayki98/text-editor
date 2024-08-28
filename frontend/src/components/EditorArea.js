// EditorArea.js
import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import ComponentRenderer from './ComponentRenderer';
import SourceCodeEditor from './SourceCodeEditor';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  display: flex;
  margin-bottom: 16px;
`;

const EditorContainer = styled(Box)`
  flex: 2;
  padding: 16px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CodeSection = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StyledTypography = styled(Typography)`
  width: 36px;
  height: 25px;
  font-weight: 500;
  line-height: 25.2px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  margin-left: 15px;
  text-align: left;
`;

const Divider = styled.hr`
  border-top: 1px solid #ddd;
  margin-bottom: 20px;
`;

const EditorArea = ({
  components,
  showSource,
  sourceCode,
  handleSourceCodeChange,
  onDragOver,
  onDrop,
  renderComponent,
  clearEditor,
  setEditorBounds
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const bounds = editorRef.current.getBoundingClientRect();
      setEditorBounds(bounds);
    }
  }, [setEditorBounds]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sourceCode.description).then(() => {
      console.log('Source code copied to clipboard!');
    });
  };

  return (
    <StyledBox>
      <EditorContainer
        ref={editorRef}
        onDragOver={onDragOver}
      >
        {!showSource && (
          <IconButton
            size="small"
            onClick={clearEditor}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <Icon
              icon="ic:baseline-close"
              width="24"
              height="24"
            />
          </IconButton>
        )}
        <Box flex={2} marginRight={2} marginTop={showSource ? 2 : 0}>
          {!showSource ? (
            <ComponentRenderer
              components={components.description}
              section="description"
              onDragOver={onDragOver}
              onDrop={onDrop}
              renderComponent={renderComponent}
            />
          ) : (
            <Box>
              <CodeSection>
                <StyledTypography variant="subtitle1">Code</StyledTypography>
                <IconButton
                  size="small"
                  onClick={copyToClipboard}
                >
                  <Icon
                    icon="mdi:content-copy"
                    width="20"
                    height="20"
                  />
                </IconButton>
              </CodeSection>
              <Divider />
              <SourceCodeEditor
                value={sourceCode.description}
                onChange={(e) => handleSourceCodeChange('description', e)}
              />
            </Box>
          )}
        </Box>
      </EditorContainer>
    </StyledBox>
  );
};

export default EditorArea;
