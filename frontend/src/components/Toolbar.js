import React from 'react';
import { Icon } from '@iconify/react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

const Button = styled.button.attrs(props => ({
  // Pass only standard HTML attributes and handle custom props separately
}))`
  width: ${props => props.width || 'auto'};
  height: 30px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7.5px;
  background-color: ${props => props.bgColor || 'transparent'};
  color: ${props => props.color || 'inherit'};
  padding: ${props => props.padding || '0'};
  border: none;
  cursor: pointer;
`;

const ButtonText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 21.6px;
  text-align: left;
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  color: ${props => props.color || 'inherit'};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;

const IconButton = styled(Button)`
  width: 30px;
  margin-right: 0.625rem;
`;

const Toolbar = ({
  toggleSidebar,
  sidebarOpen,
  undo,
  redo,
  undoStack,
  redoStack,
  showSource,
  setShowSource
}) => {
  return (
    <ToolbarContainer>
      <Button
        onClick={toggleSidebar}
        width="117px"
        bgColor="#E3F3FF"
        color="#002E47"
      >
        <Icon icon="mdi:plus" width="16" height="16" />
        <ButtonText width="73px">Add Element</ButtonText>
      </Button>
      <ButtonGroup>
        <IconButton
          onClick={undo}
          disabled={undoStack.length === 0}
          bgColor="#F4F6F8"
        >
          <Icon icon="lucide:undo" width="20" height="20" />
        </IconButton>
        <IconButton
          onClick={redo}
          disabled={redoStack.length === 0}
          bgColor="#F4F6F8"
        >
          <Icon icon="lucide:redo" width="20" height="20" />
        </IconButton>
        {showSource ? (
          <Button
            onClick={() => setShowSource(!showSource)}
            width="110px"
            bgColor="#015FFB"
            color="white"
            padding="0.25rem 0.75rem"
          >
            <ButtonText>Exit Code View</ButtonText>
          </Button>
        ) : (
          <Button
            onClick={() => setShowSource(!showSource)}
            width="86px"
            bgColor="#F4F6F8"
            color="#002E47"
            padding="0.25rem 0.75rem"
          >
            <ButtonText width="73px" height="22px">
              Code View
            </ButtonText>
          </Button>
        )}
      </ButtonGroup>
    </ToolbarContainer>
  );
};

export default Toolbar;
