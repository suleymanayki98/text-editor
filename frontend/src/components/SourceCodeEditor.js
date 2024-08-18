// SourceCodeEditor.js
import React from 'react';
import { Box, TextField } from '@mui/material';

const SourceCodeEditor = ({ value, onChange }) => {
  const lines = value.split('\n');

  return (
    <Box position="relative" sx={{ fontFamily: 'monospace', whiteSpace: 'pre', overflow: 'auto' }}>
      <TextField
        multiline
        fullWidth
        variant="outlined"
        value={value}
        onChange={onChange}
        InputProps={{
          style: {
            fontFamily: 'monospace',
            lineHeight: '1.5em',
            paddingLeft: '3em',
            border: 'none', // Remove the border
          },
          // Remove the outline when focused
          sx: {
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused fieldset': { border: 'none' },
          },
        }}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        sx={{
          pointerEvents: 'none',
          userSelect: 'none',
          width: '24px',
          backgroundColor: 'white',
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          paddingRight: '0.5em',
          paddingTop: '14px', // Adjust this to align with TextField content
        }}
      >
        {lines.map((_, index) => (
          <div key={index} style={{ color: 'gray', lineHeight: '1.5em' }}>
            {index + 1}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default SourceCodeEditor;