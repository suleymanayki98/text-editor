// ComponentRenderer.js
import React from 'react';
import { Box } from '@mui/material';

const ComponentRenderer = ({ components, section, onDragOver, onDrop, renderComponent }) => {
  return (
    <Box
      flex={1}
      p={2}
      borderRadius={2}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, section, components.length)}
      className="min-h-[400px]"
    >
      {components.map((component, index) => renderComponent(component, section, index))}
    </Box>
  );
};

export default ComponentRenderer;