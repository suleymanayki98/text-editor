// Sidebar.js
import React, { useRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

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
    <button
      onDragStart={handleDragStart(type)}
      onDragEnd={handleDragEnd}
      draggable
      className={`
        bg-white border rounded-lg w-110 h-90 flex flex-col items-center justify-center
        font-inter capitalize
        ${draggingButton === type ? 'border-custom-blue border-2' : 'border-custom-gray'}
      `}
    >
      <Icon icon={icon} width="40" height="40" className="text-gray-500" />
      <p className="text-custom-black text-xs mt-2.5">{text}</p>
    </button>
  );

  return (
    <div
      ref={sidebarRef}
      onMouseDown={handleMouseDown}
      className="fixed w-272 h-426 bg-light-gray shadow-lg z-50"
      style={{
        left: sidebarPosition.x,
        top: sidebarPosition.y,
      }}
    >
      <div className="handle p-2 bg-gray-100 cursor-move relative rounded-r-3xl">
        <hr className="w-20 border-t-4 border-gray-300 mx-auto mt-1 mb-3" />
        <p className="text-sm text-dark-blue font-inter font-medium leading-normal w-156 h-22">Add Element</p>
        <button
          onClick={toggleSidebar}
          className="absolute right-2 mt-3 top-3"
        >
          <Icon icon="ic:baseline-close" className="w-6 h-6" />
        </button>
      </div>
      <div className="px-2">
        <p className="text-sm text-gray-600 mb-2.5 font-inter font-medium leading-normal w-228 h-22">
          Basics
        </p>
        <div className="flex justify-between mb-2.5">
          {renderButton(COMPONENT_TYPES.PARAGRAPH, "mdi:text", "Text")}
          {renderButton(COMPONENT_TYPES.BUTTON, "fluent:button-16-regular", "Button")}
        </div>
        <div className="flex justify-between mb-2.5">
          {renderButton(COMPONENT_TYPES.TWO_COLUMN, "mingcute:columns-2-line", "2 Column")}
          {renderButton(COMPONENT_TYPES.ONE_COLUMN, "akar-icons:square", "1 Column")}
        </div>
        <p className="text-sm text-gray-600 mb-2.5 font-inter font-medium leading-normal w-228 h-22">
          Text
        </p>
        <div className="flex justify-between mb-2.5">
          {renderButton(COMPONENT_TYPES.H1, "icon-park-outline:h1", "H1")}
          {renderButton(COMPONENT_TYPES.H2, "icon-park-outline:h2", "H2")}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;