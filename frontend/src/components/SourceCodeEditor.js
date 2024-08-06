// SourceCodeEditor.js
import React from 'react';
import { TextField } from '@mui/material';

const SourceCodeEditor = ({ value, onChange }) => {
  return (
    <TextField
      fullWidth
      multiline
      variant="outlined"
      value={value}
      onChange={onChange}
      rows={20}
      style={{ borderRadius: '4px' }}
    />
  );
};

export default SourceCodeEditor;