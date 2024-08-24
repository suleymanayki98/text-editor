// EditorArea.js
import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import ComponentRenderer from './ComponentRenderer';
import SourceCodeEditor from './SourceCodeEditor';
import styled from 'styled-components';

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
    <Box display="flex" mb={2}>
      <Box
        ref={editorRef}
        flex={2}
        p={2}
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        display="flex"
        flexDirection="column"
        position="relative"
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
        <Box flex={2} mr={2} mt={showSource ? 2 : 0}>
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <StyledTypography  variant="subtitle1">Code</StyledTypography>
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
              </Box>
              <hr className="border-t border-[#ddd] mb-[20px]" />
              <SourceCodeEditor
                value={sourceCode.description}
                onChange={(e) => handleSourceCodeChange('description', e)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EditorArea;