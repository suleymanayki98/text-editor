// ComponentRenderer.js
import React from 'react';
import styled from 'styled-components';

const StyledBox = styled.div`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  min-height: 400px;
`;

const ComponentRenderer = ({ components, section, onDragOver, onDrop, renderComponent }) => {
  return (
    <StyledBox
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, section, components.length)}
    >
      {components.map((component, index) => renderComponent(component, section, index))}
    </StyledBox>
  );
};

export default ComponentRenderer;
