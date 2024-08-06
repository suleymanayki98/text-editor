// EditorArea.js
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
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
  return (
    <Box display="flex" mb={2}>
      <Box
        flex={2}
        p={2}
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        display="flex"
        position="relative"
      >
        <IconButton
          size="small"
          onClick={clearEditor}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <Icon icon="ic:baseline-close" width="24" height="24" />
        </IconButton>
        <Box flex={2} mr={2}>
          <Typography variant="h6" mb={2}>Description</Typography>
          <hr style={{ marginTop: '10px', border: 'none', borderTop: '2px solid #ddd' }} />
          {!showSource ? (
            <ComponentRenderer
              components={components.description}
              section="description"
              onDragOver={onDragOver}
              onDrop={onDrop}
              renderComponent={renderComponent}
            />
          ) : (
            <SourceCodeEditor
              value={sourceCode.description}
              onChange={(e) => handleSourceCodeChange('description', e)}
            />
          )}
        </Box>
        <Box flex={1}>
          <Typography variant="h6" mb={2}>About</Typography>
          <hr style={{ marginTop: '10px', border: 'none', borderTop: '2px solid #ddd' }} />
          {!showSource ? (
            <ComponentRenderer
              components={components.about}
              section="about"
              onDragOver={onDragOver}
              onDrop={onDrop}
              renderComponent={renderComponent}
            />
          ) : (
            <SourceCodeEditor
              value={sourceCode.about}
              onChange={(e) => handleSourceCodeChange('about', e)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EditorArea;