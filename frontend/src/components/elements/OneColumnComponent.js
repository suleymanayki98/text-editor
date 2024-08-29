// components/OneColumnComponent.js
import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';

const OneColumnWrapper = styled(Box)`
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-bottom: 0.625rem;
  padding: 0.625rem;
`;

const OneColumnContent = styled(Box)`
  min-height: 100px;
`;

const OneColumnComponent = ({ component, section, index, setIsDragging, setActiveColumn, setMousePosition, setShowHr, onDrop, renderComponent }) => {
  return (
    <OneColumnWrapper>
      <OneColumnContent
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowHr(true);
          const columnRect = e.currentTarget.getBoundingClientRect();
          setActiveColumn({
            left: columnRect.left,
            top: columnRect.top,
            width: columnRect.width,
            height: columnRect.height,
          });
          setIsDragging(true);
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDrop(e, section, index, 0);
          setShowHr(true);
        }}
      >
        {(component.content || []).map((nestedComponent, nestedIndex) =>
          renderComponent(nestedComponent, section, `${index}-${nestedIndex}`, 0)
        )}
      </OneColumnContent>
    </OneColumnWrapper>
  );
};

export default OneColumnComponent;