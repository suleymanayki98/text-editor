// Toolbar.js
import React from 'react';
import { Icon } from '@iconify/react';

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
    <div className="flex justify-between mb-2 mt-2">
      <button
        onClick={toggleSidebar}
        className="bg-custom-light-blue text-custom-dark w-[117px] h-[30px] rounded-lg flex items-center justify-center gap-1"
      >
        <Icon icon="mdi:plus" width="16" height="16" />
        <span className="font-inter text-xs font-normal leading-[21.6px] text-left w-[73px]">
          Add Element
        </span>
      </button>
      <div className="flex justify-end flex-grow">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="w-[30px] h-[30px] rounded-lg bg-custom-gray mr-2.5 flex items-center justify-center"
        >
          <Icon icon="lucide:undo" width="20" height="20" className="text-black" />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="w-[30px] h-[30px] rounded-lg bg-custom-gray mr-2.5 flex items-center justify-center"
        >
          <Icon icon="lucide:redo" width="20" height="20" className="text-black" />
        </button>
        {showSource ? (
          <button
            onClick={() => setShowSource(!showSource)}
            className="bg-custom-blue text-white w-[110px] h-[30px] px-3 py-1 rounded-lg flex items-center justify-center"
          >
            <span className="font-inter text-xs font-normal leading-[21.6px] text-left">
              Exit Code View
            </span>
          </button>
        ) : (
          <button
            onClick={() => setShowSource(!showSource)}
              className="bg-[#F4F6F8] text-black w-[86px] h-[30px]  px-3 py-1 rounded-lg flex items-center justify-center"
          >
            <span className="font-inter text-xs font-normal leading-[21.6px] text-[#002E47] w-[73px] h-[22px] text-left"
>
              Code View
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;