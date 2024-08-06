import { COMPONENT_TYPES } from './constants/constants';

export const updateSourceCode = (components, setSourceCode) => {
  const generateCode = (sectionComponents) =>
    sectionComponents
      .map(component => {
        if (component.type === COMPONENT_TYPES.PARAGRAPH) {
          return `<p>${component.text || 'This is a paragraph.'}</p>`;
        }
        if (component.type === COMPONENT_TYPES.BUTTON) {
          return `<button>${component.text || 'Button'}</button>`;
        }
        if (component.type === COMPONENT_TYPES.TWO_COLUMN) {
          return `<div class="two-column-layout">
            <div class="column">${generateCode(component.columns[0])}</div>
            <div class="column">${generateCode(component.columns[1])}</div>
          </div>`;
        }
        return '';
      })
      .join('\n');

  const newSourceCode = {
    description: generateCode(components.description),
    about: generateCode(components.about)
  };
  setSourceCode(newSourceCode);
};

export const parseComponents = (code, section) => {
  const components = [];
  const regex = /<(p|button|div class="two-column-layout")>([\s\S]*?)<\/\1>/g;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match[1] === 'p') {
      components.push({ type: COMPONENT_TYPES.PARAGRAPH, text: match[2].trim() });
    } else if (match[1] === 'button') {
      components.push({ type: COMPONENT_TYPES.BUTTON, text: match[2].trim() });
    } else if (match[1] === 'div class="two-column-layout"') {
      const columns = match[2].split('</div><div class="column">').map(col =>
        parseComponents(`<div>${col}</div>`, section)
      );
      components.push({ type: COMPONENT_TYPES.TWO_COLUMN, columns });
    }
  }

  return components;
};

export const renderComponent = (component, section, index, columnIndex, draggingIndex, setDraggingIndex, updateComponents, setEditingIndex) => {
  return (
    <div
      key={index}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('type', component.type);
        e.dataTransfer.setData('index', index.toString());
        setDraggingIndex(index);
      }}
      onDragEnd={() => setDraggingIndex(null)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        margin: '5px 0',
        backgroundColor: draggingIndex === index ? '#f0f0f0' : '#fff',
        boxShadow: draggingIndex === index ? '0 0 5px rgba(0, 0, 0, 0.2)' : 'none'
      }}
    >
      {component.type === COMPONENT_TYPES.PARAGRAPH && <p>{component.text}</p>}
      {component.type === COMPONENT_TYPES.BUTTON && <button>{component.text}</button>}
      {component.type === COMPONENT_TYPES.TWO_COLUMN && (
        <div style={{ display: 'flex' }}>
          {component.columns.map((col, colIndex) => (
            <div key={colIndex} style={{ flex: 1, margin: '0 5px' }}>
              {col.map((comp, compIndex) => renderComponent(comp, section, compIndex, colIndex, draggingIndex, setDraggingIndex, updateComponents, setEditingIndex))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
