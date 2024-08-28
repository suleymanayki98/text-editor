import React from 'react';
import { Icon } from '@iconify/react';
import styled from 'styled-components';

// Styled components
const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  width: ${({ width }) => width || 'auto'};
  height: 30px;
  border-radius: 8px; /* lg */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px; /* gap-1 */
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
  color: ${({ textColor }) => textColor || 'black'};
  padding: ${({ padding }) => padding || '0'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconButton = styled(Button)`
  width: 30px;
  margin-right: 8px; /* mr-2.5 */
`;

const Text = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 12px; /* xs */
  font-weight: 400;
  line-height: 21.6px; /* tight */
  text-align: left;
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
        bgColor="#E3F3FF" /* custom-light-blue */
        textColor="#002E47" /* custom-dark */
      >
        <Icon icon="mdi:plus" width="16" height="16" />
        <Text>Add Element</Text>
      </Button>
      <div style={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
        <IconButton
          onClick={undo}
          disabled={undoStack.length === 0}
          bgColor="#F4F6F8" /* custom-gray */
        >
          <Icon icon="lucide:undo" width="20" height="20" className="text-black" />
        </IconButton>
        <IconButton
          onClick={redo}
          disabled={redoStack.length === 0}
          bgColor="#F4F6F8" /* custom-gray */
        >
          <Icon icon="lucide:redo" width="20" height="20" className="text-black" />
        </IconButton>
        {showSource ? (
          <Button
            onClick={() => setShowSource(!showSource)}
            width="110px"
            bgColor="#015FFB" /* custom-blue */
            textColor="#FFFFFF" /* custom-white */
            padding="0.25rem 0.75rem"
          >
            <Text>Exit Code View</Text>
          </Button>
        ) : (
          <Button
            onClick={() => setShowSource(!showSource)}
            width="86px"
            bgColor="#F4F6F8" /* light-gray */
            textColor="#002E47" /* dark-blue */
            padding="0.25rem 0.75rem"
          >
            <Text>Code View</Text>
          </Button>
        )}
      </div>
    </ToolbarContainer>
  );
};

export default Toolbar;
