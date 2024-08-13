// Sidebar.js
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Icon } from '@iconify/react';

const Sidebar = ({ sidebarPosition, setSidebarPosition, toggleSidebar, COMPONENT_TYPES }) => {
  const sidebarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ... (handleMouseDown, handleMouseMove, handleMouseUp functions)

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  
  const handleMouseUp = () => {
    setIsDragging(false);
  };


  const handleMouseDown = (e) => {
    if (e.target.classList.contains('handle')) {
      setIsDragging(true);
      const rect = sidebarRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setSidebarPosition({ x: newX, y: newY });
    }
  };


  return (
    <Box
      ref={sidebarRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: sidebarPosition.x,
        top: sidebarPosition.y,
        width: '350px',
        backgroundColor: '#f5f5f5',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        overflowY: 'auto',
      }}
    >
      {/* Sidebar content */}
      {toggleSidebar && (
        <Box
          ref={sidebarRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'fixed',
            left: sidebarPosition.x,
            top: sidebarPosition.y,
            width: '350px',
            backgroundColor: '#f5f5f5',
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            overflowY: 'auto',
          }}
        >
          <Box className="handle" p={2} bgcolor="grey.100" style={{ cursor: 'move', position: 'relative' }}>
            <hr style={{ marginTop: '-5px', width: '120px', border: 'none', borderTop: '4px solid #ddd' }} />
            <Typography variant="h7"><strong>Add Element</strong></Typography>
            <IconButton
              aria-label="close"
              onClick={toggleSidebar}
              style={{
                position: 'absolute',
                right: 8,
                top: 12,
              }}
            >
              <Icon icon="ic:baseline-close" width="24" height="24" />
            </IconButton>
          </Box>
          <Box p={2}>
            <Typography variant="body2" style={{ fontSize: '18px', color: 'black', marginBottom: '10px', marginTop: '10px' }}>
              Basics
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.PARAGRAPH);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="mdi:text" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  Text
                </Typography>
              </Button>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.BUTTON);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="fluent:button-16-regular" width="40" height="" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  Button
                </Typography>
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.TWO_COLUMN);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="mingcute:columns-2-line" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  2 Column
                </Typography>
              </Button>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.ONE_COLUMN);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="akar-icons:square" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  1 Column
                </Typography>
              </Button>
            </div>
            <Typography variant="body2" style={{ fontSize: '18px', color: 'black', marginBottom: '10px', marginTop: '10px' }}>
              Text
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.H1);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="icon-park-outline:h1" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  H1
                </Typography>
              </Button>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.H2);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="icon-park-outline:h2" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  H2
                </Typography>
              </Button>
            </div>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;