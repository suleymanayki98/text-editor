import React, { useState } from 'react';
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
  position: relative;
`;

const OneColumnComponent = ({
  component,
  section,
  index,
  setIsDragging,
  setActiveColumn,
  onDrop,
  renderComponent,
}) => {

  return (
    <OneColumnWrapper>
      <OneColumnContent
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const columnRect = e.currentTarget.getBoundingClientRect();
          setActiveColumn({
            left: columnRect.left,
            top: columnRect.top,
            width: columnRect.width,
            height: columnRect.height,
          });
          setIsDragging(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDrop(e, section, index, 0);
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