import React, { useState } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';

const TwoColumnWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  min-height: 200px;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-bottom: 0.625rem;
  position: relative;
`;

const ColumnWrapper = styled(Box)`
  flex: 1;
  padding: 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TwoColumnComponent = ({
  component,
  section,
  index,
  onDrop,
  setActiveColumn,
  setIsDragging,
  renderComponent,
}) => {

  return (
    <TwoColumnWrapper>
      {(component.columns || [[], []]).map((column, colIndex) => (
        <ColumnWrapper
          key={`${component.id}-col-${colIndex}`}
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
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveColumn(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDrop(e, section, index, colIndex);
            setActiveColumn(null);
            setIsDragging(false);
          }}
        >
          {(column || []).map((nestedComponent, nestedIndex) =>
            renderComponent(nestedComponent, section, `${index}-${nestedIndex}`, colIndex)
          )}
        </ColumnWrapper>
      ))}
    </TwoColumnWrapper>
  );
};

export default TwoColumnComponent;