// EditorArea.js
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import ComponentRenderer from './ComponentRenderer';
import SourceCodeEditor from './SourceCodeEditor';

const EditorArea = ({
  components,
  showSource,
  sourceCode,
  handleSourceCodeChange,
  onDragOver,
  onDrop,
  renderComponent,
  clearEditor
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(sourceCode.description).then(() => {
      console.log('Source code copied to clipboard!');
    });
  };

  return (
    <Box display="flex" mb={2}>
      <Box
        flex={2}
        p={2}
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        display="flex"
        flexDirection="column"
        position="relative"
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
                <Typography variant="subtitle1">Code</Typography>
                <IconButton
                  size="small"
                  onClick={copyToClipboard}
                >
                  <Icon
                    icon="mdi:content-copy"
                    width="24"
                    height="24"
                  />
                </IconButton>
              </Box>
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