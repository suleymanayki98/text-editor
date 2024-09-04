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

const HorizontalRule = styled.hr`
  border: none;
  border-top: 3px solid #0000FF;
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  transform: translateY(${({ top }) => top}px);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: all 50ms linear;
`;

const TwoColumnComponent = ({
  component,
  section,
  index,
  onDrop,
  setActiveColumn,
  setMousePosition,
  setIsDragging,
  renderComponent,
}) => {
  const [hrTop, setHrTop] = useState(0);
  const [hrVisible, setHrVisible] = useState(false);

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
            setMousePosition({ x: e.clientX, y: e.clientY });
            setHrTop(e.clientY - columnRect.top);
            setHrVisible(true);
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveColumn(null);
            setHrVisible(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDrop(e, section, index, colIndex);
            setActiveColumn(null);
            setHrVisible(false);
            setIsDragging(false);
          }}
        >
          {hrVisible && <HorizontalRule top={hrTop} visible={hrVisible} />}
          {(column || []).map((nestedComponent, nestedIndex) =>
            renderComponent(nestedComponent, section, `${index}-${nestedIndex}`, colIndex)
          )}
        </ColumnWrapper>
      ))}
    </TwoColumnWrapper>
  );
};

export default TwoColumnComponent;