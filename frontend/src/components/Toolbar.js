// Toolbar.js
import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';

const Toolbar = ({
  toggleSidebar,
  sidebarOpen,
  undo,
  redo,
  undoStack,
  redoStack,
  showSource,
  setShowSource
}) => {
  return (
    <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
      <IconButton size="small" variant="contained" onClick={toggleSidebar} style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '10%', 
          padding: 10, 
          color: 'black',
        }}>
          <Icon icon="mdi:plus" width="24" height="24"  style={{color: 'black'}} /> {'Add Element'}
        </IconButton>
      <Box display="flex" justifyContent="flex-end" style={{ flexGrow: 1 }}>
        <IconButton size="small" variant="contained" onClick={undo} disabled={undoStack.length === 0} style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '15%', 
          padding: 10, 
          color: 'black',
        }}>
          <Icon icon="lucide:undo" width="24" height="24" />
        </IconButton>
        <IconButton size="small" variant="contained" onClick={redo} disabled={redoStack.length === 0} style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '15%', 
          padding: 10, 
          color: 'black',
          marginLeft: '10px'
        }}>
          <Icon icon="lucide:redo" width="24" height="24" />
        </IconButton>
        <IconButton size="small" variant="contained"  onClick={() => setShowSource(!showSource)} style={{
          backgroundColor: showSource ? '#1976d2' : '#f5f5f5',
          borderRadius: '10px', 
          padding: 10, 
          color: showSource ? 'white' : 'black',
          marginLeft: '10px'
        }}>
          {showSource ? 'Exit Code View' : 'Code View'}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Toolbar;