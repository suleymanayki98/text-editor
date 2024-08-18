// Toolbar.js
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
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
      <IconButton
        size="small"
        variant="contained"
        onClick={toggleSidebar}
        style={{
          backgroundColor: '#E3F3FF',
          borderRadius: '8px',
          padding: '12px 12px', // Adjusted padding to match requirements
          color: '#002E47',
          width: '117px', // Set width to 117px
          height: '30px', // Set height to 30px
          gap: '4px', // Added gap between icon and text
          display: 'flex', // Ensure the gap works by using flex layout
          alignItems: 'center', // Vertically center the icon and text
          justifyContent: 'center' // Center the content horizontally
        }}
      >
        <Icon
          icon="mdi:plus"
          width="16"
          height="16"
        />
        <Typography
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '21.6px',
            textAlign: 'left',
            color: '#002E47',
            width: '73px',
            height: '22px'
          }}
        >
          {'Add Element'}
        </Typography>
      </IconButton>
      <Box display="flex" justifyContent="flex-end" style={{ flexGrow: 1 }}>
        <IconButton size="small" variant="contained" onClick={undo} disabled={undoStack.length === 0} style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          gap: '7.5px',
          backgroundColor: '#F4F6F8',
        }}>
          <Icon icon="lucide:undo" width="20" height="20" style={{ color: 'black' }} />
        </IconButton>
        <IconButton size="small" variant="contained" onClick={redo} disabled={redoStack.length === 0} style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          gap: '7.5px',
          backgroundColor: '#F4F6F8',
          marginLeft: '10px'
        }}>
          <Icon icon="lucide:redo" width="20" height="20" style={{ color: 'black' }} />
        </IconButton>
        {showSource ? (
        <IconButton
          size="small"
          variant="contained"
          onClick={() => setShowSource(!showSource)}
          style={{
            backgroundColor: '#015FFB',
            color: 'white',
            width: '110px',
            height: '30px',
            padding: '4px 12px',
            gap: '8px',
            borderRadius: '8px',
            marginLeft: '10px'
          }}
        >
          <Typography
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '21.6px',
              textAlign: 'left',
              width: '86px',
              height: '22px'
            }}
          >
            Exit Code View
          </Typography>
        </IconButton>
      ) : (
        <IconButton
          size="small"
          variant="contained"
          onClick={() => setShowSource(!showSource)}
          style={{
            backgroundColor: '#F4F6F8',
            color: 'black',
            width: '86px',
            height: '30px',
            padding: '4px 12px',
            gap: '8px',
            borderRadius: '8px',
            marginLeft: '10px'
          }}
        >
          <Typography
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '21.6px',
              textAlign: 'left',
              color: '#002E47',
              width: '73px',
              height: '22px'
            }}
          >
            Code View
          </Typography>
        </IconButton>
      )}
      </Box>
    </Box>
  );
};

export default Toolbar;