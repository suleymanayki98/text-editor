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

const OneColumnComponent = ({
  component,
  section,
  index,
  setIsDragging,
  setActiveColumn,
  setMousePosition,
  onDrop,
  renderComponent,
}) => {
  const [hrTop, setHrTop] = useState(0);
  const [hrVisible, setHrVisible] = useState(false);

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
          setMousePosition({ x: e.clientX, y: e.clientY });
          setHrTop(e.clientY - columnRect.top);
          setHrVisible(true);
        }}
        onDragLeave={(e) => {
          setHrVisible(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDrop(e, section, index, 0);
          setHrVisible(false);
        }}
      >
        {hrVisible && <HorizontalRule top={hrTop} visible={hrVisible} />}
        {(component.content || []).map((nestedComponent, nestedIndex) =>
          renderComponent(nestedComponent, section, `${index}-${nestedIndex}`, 0)
        )}
      </OneColumnContent>
    </OneColumnWrapper>
  );
};

export default OneColumnComponent;