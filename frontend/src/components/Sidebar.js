// Sidebar.js
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Icon } from '@iconify/react';

const Sidebar = ({ sidebarPosition, setSidebarPosition, toggleSidebar, COMPONENT_TYPES }) => {
  const sidebarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingButton, setDraggingButton] = useState(null);

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

  const handleDragStart = (type) => (e) => {
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('id', Date.now().toString());
    setDraggingButton(type);
  };

  const handleDragEnd = () => {
    setDraggingButton(null);
  };

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

  return (
    <Box
      ref={sidebarRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: sidebarPosition.x,
        top: sidebarPosition.y,
        width: '272px',
        height: '426px',
        backgroundColor: '#F4F6F8',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      <Box className="handle" p={2} bgcolor="grey.100" style={{ cursor: 'move', position: 'relative' }}>
        <hr style={{ marginTop: '-5px', width: '80px', border: 'none', borderTop: '4px solid #ddd' }} />
        <Typography style={{
          fontSize: '14px',
          color: '#002E47',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          lineHeight: '22px',
          width: '156px',
          height: '22px'
        }}>Add Element</Typography>
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
      <Box pr={2} pl={2}>
        <Typography variant="body2" style={{
          fontSize: '14px',
          color: '#637381',
          marginBottom: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          lineHeight: '22px',
          textAlign: 'left',
          width: '228px',
          height: '22px'
        }}>
          Basics
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <Button
            variant="outlined"
            onDragStart={handleDragStart(COMPONENT_TYPES.PARAGRAPH)}
            onDragEnd={handleDragEnd}
            draggable
            style={{
              backgroundColor: 'white',
              borderColor: draggingButton === COMPONENT_TYPES.PARAGRAPH ? '#015FFB' : '#ebebeb',
              borderWidth: draggingButton === COMPONENT_TYPES.PARAGRAPH ? '2px' : '1px',
              width: '110px',
              height: '90px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
              border: '1px solid var(--Border, #919EAB52)',
              alignItems: 'center',
              textTransform: 'capitalize',
            }}
          >
            <Icon icon="mdi:text" width="40" height="40" style={{ color: 'grey' }} />
            <Typography style={{ color: 'black', textAlign: 'center', fontSize: '12px', marginTop: '10px' }}>
              Text
            </Typography>
          </Button>

          <Button
            variant="outlined"
            onDragStart={handleDragStart(COMPONENT_TYPES.BUTTON)}
            onDragEnd={handleDragEnd}
            draggable
            style={{
              backgroundColor: 'white',
              borderColor: draggingButton === COMPONENT_TYPES.BUTTON ? '#015FFB' : '#ebebeb',
              borderWidth: draggingButton === COMPONENT_TYPES.BUTTON ? '2px' : '1px',
              width: '110px',
              height: '90px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              border: '1px solid var(--Border, #919EAB52)',
              alignItems: 'center',
              textTransform: 'capitalize',
            }}
          >
            <Icon icon="fluent:button-16-regular" width="40" height="" style={{ color: 'grey' }} />
            <Typography style={{ color: 'black', textAlign: 'center', fontSize: '12px', marginTop: '10px' }}>
              Button
            </Typography>
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <Button
            variant="outlined"
            onDragStart={handleDragStart(COMPONENT_TYPES.TWO_COLUMN)}
            onDragEnd={handleDragEnd}
            draggable
            style={{
              backgroundColor: 'white',
              borderColor: draggingButton === COMPONENT_TYPES.TWO_COLUMN ? '#015FFB' : '#ebebeb',
              borderWidth: draggingButton === COMPONENT_TYPES.TWO_COLUMN ? '2px' : '1px',
              width: '110px',
              height: '90px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
              border: '1px solid var(--Border, #919EAB52)',
              alignItems: 'center',
              textTransform: 'capitalize',
            }}
          >
            <Icon icon="mingcute:columns-2-line" width="40" height="40" style={{ color: 'grey' }} />
            <Typography style={{ color: 'black', textAlign: 'center', fontSize: '12px', marginTop: '10px' }}>
              2 Column
            </Typography>
          </Button>

          <Button
            variant="outlined"
            onDragStart={handleDragStart(COMPONENT_TYPES.ONE_COLUMN)}
            onDragEnd={handleDragEnd}
            draggable
            style={{
              backgroundColor: 'white',
              borderColor: draggingButton === COMPONENT_TYPES.ONE_COLUMN ? '#015FFB' : '#ebebeb',
              borderWidth: draggingButton === COMPONENT_TYPES.ONE_COLUMN ? '2px' : '1px',
              width: '110px',
              height: '90px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
              border: '1px solid var(--Border, #919EAB52)',
              alignItems: 'center',
              textTransform: 'capitalize',
            }}
          >
            <Icon icon="akar-icons:square" width="40" height="40" style={{ color: 'grey' }} />
            <Typography style={{ color: 'black', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
              1 Column
            </Typography>
          </Button>
        </div>
        <Typography variant="body2" style={{
          fontSize: '14px',
          color: '#637381',
          marginBottom: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          lineHeight: '22px',
          textAlign: 'left',
          width: '228px',
          height: '22px'
        }}>
          Text
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <Button
            variant="outlined"
            onDragStart={handleDragStart(COMPONENT_TYPES.H1)}
            onDragEnd={handleDragEnd}
            draggable
            style={{
              backgroundColor: 'white',
              borderColor: draggingButton === COMPONENT_TYPES.H1 ? '#015FFB' : '#ebebeb',
              borderWidth: draggingButton === COMPONENT_TYPES.H1 ? '2px' : '1px',
              width: '110px',
              height: '90px',
              fontFamily: 'Inter, sans-serif',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '8px',
              border: '1px solid var(--Border, #919EAB52)',
              alignItems: 'center',
              textTransform: 'capitalize',
            }}
          >
            <Icon icon="icon-park-outline:h1" width="40" height="40" style={{ color: 'grey' }} />
            <Typography style={{ color: 'black', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
              H1
            </Typography>
          </Button>

          <Button
            variant="outlined"
            onDragStart={handleDragStart(COMPONENT_TYPES.H2)}
            onDragEnd={handleDragEnd}
            draggable
            style={{
              backgroundColor: 'white',
              borderColor: draggingButton === COMPONENT_TYPES.H2 ? '#015FFB' : '#ebebeb',
              borderWidth: draggingButton === COMPONENT_TYPES.H2 ? '2px' : '1px',
              width: '110px',
              height: '90px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
              border: '1px solid var(--Border, #919EAB52)',
              alignItems: 'center',
              textTransform: 'capitalize',
            }}
          >
            <Icon icon="icon-park-outline:h2" width="40" height="40" style={{ color: 'grey' }} />
            <Typography style={{ color: 'black', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
              H2
            </Typography>
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default Sidebar;