import React, { useRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import styled from 'styled-components';

// Styled components
const SidebarContainer = styled.div`
  position: fixed;
  width: 272px;
  height: 426px;
  background-color: #F4F6F8;
  z-index: 50;
  border-radius: 1.5rem; /* 24px */
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
`;

const Handle = styled.div`
  padding: 8px;
  background-color: #F4F6F8;
  cursor: move;
  position: relative;
  border-top-right-radius: 1.5rem; /* 24px */
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  margin-top: 5px;
`;

const Title = styled.p`
  font-size: 0.875rem; /* 14px */
  color: #002E47; /* Dark blue */
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  line-height: 1.5rem; /* 24px */
  margin: 0;
  padding-left: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
`;

const Divider = styled.hr`
  width: 80px;
  border-top: 3px solid #919EAB; /* Light gray color */
  margin: 8px auto;
  margin-bottom: 0;
`;

const SectionTitle = styled.p`
  font-size: 0.875rem; /* 14px */
  color: #637381; 
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  line-height: 22px;
  width: 228px;
  height: 22px;
  margin-bottom: 0.125rem;
  margin-top: 0;
`;

const Button = styled.button`
  background-color: #ffffff; /* White */
  border: 1px solid ${({ isDragging }) => (isDragging ? '#015FFB' : '#919EAB')}; /* Custom blue or gray */
  border-radius:  8px;
  width: 110px;
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  text-transform: capitalize;
  cursor: pointer;
`;

const ButtonIcon = styled(Icon)`
  color: #637381; /* Gray */
`;

const ButtonText = styled.p`
  color: #002e47; /* Dark blue */
  font-size: 0.75rem; /* 12px */
  margin-top: 0.625rem; /* 10px */
`;

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

  const renderButton = (type, icon, text) => (
    <Button
      onDragStart={handleDragStart(type)}
      onDragEnd={handleDragEnd}
      draggable
      isDragging={draggingButton === type}
    >
      <ButtonIcon icon={icon} width="40" height="40" />
      <ButtonText>{text}</ButtonText>
    </Button>
  );

  return (
    <SidebarContainer
      ref={sidebarRef}
      x={sidebarPosition.x}
      y={sidebarPosition.y}
      onMouseDown={handleMouseDown}
    >
      
      <Divider />
      <Handle className="handle">
        <Title>Add Element</Title>
        <CloseButton onClick={toggleSidebar}>
          <Icon icon="ic:baseline-close" width="24" height="24" />
        </CloseButton>
      </Handle>
      <div style={{ padding: '8px' }}>
        <SectionTitle>Basics</SectionTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {renderButton(COMPONENT_TYPES.PARAGRAPH, "mdi:text", "Text")}
          {renderButton(COMPONENT_TYPES.BUTTON, "fluent:button-16-regular", "Button")}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {renderButton(COMPONENT_TYPES.TWO_COLUMN, "mingcute:columns-2-line", "2 Column")}
          {renderButton(COMPONENT_TYPES.ONE_COLUMN, "akar-icons:square", "1 Column")}
        </div>
        <SectionTitle>Text</SectionTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {renderButton(COMPONENT_TYPES.H1, "icon-park-outline:h1", "H1")}
          {renderButton(COMPONENT_TYPES.H2, "icon-park-outline:h2", "H2")}
        </div>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
