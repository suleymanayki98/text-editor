// SourceCodeEditor.js
import React from 'react';

const SourceCodeEditor = ({ value, onChange }) => {
  const lines = value.split('\n');

  return (
    <div className="relative font-mono whitespace-pre overflow-auto">
      <textarea
        className="w-full font-mono leading-normal pl-12 border-none outline-none focus:ring-0 hover:border-none focus:border-none"
        value={value}
        onChange={onChange}
        style={{lineHeight: '1.5em'}}
      />
      <div className="absolute top-0 left-0 bottom-0 pointer-events-none select-none w-6 bg-white border-r border-gray-300 flex flex-col items-end pr-2 pt-3.5">
        {lines.map((_, index) => (
          <div key={index} className="text-gray-500" style={{lineHeight: '1.5em'}}>
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceCodeEditor;