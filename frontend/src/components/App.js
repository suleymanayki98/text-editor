import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, Container, Typography, TextField, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';

const COMPONENT_TYPES = {
  PARAGRAPH: 'paragraph',
  BUTTON: 'button',
  TWO_COLUMN: 'two-column',
  H1: 'h1',
};

const DragDropEditor = () => {
  const [components, setComponents] = useState({ description: [], about: [] });
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState({ section: null, index: null });
  const [sourceCode, setSourceCode] = useState({ description: '', about: '' });
  const [showSource, setShowSource] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const updateComponents = (newComponents) => {
    setUndoStack([...undoStack, components]);
    setRedoStack([]);
    setComponents(newComponents);
    updateSourceCode(newComponents);
  };

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

  const handleMouseUp = () => {
    setIsDragging(false);
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

  const onDragStart = (e, section, index, columnIndex) => {
    setDraggingIndex({ section, index, columnIndex });
    e.dataTransfer.setData('text/plain', JSON.stringify({ section, index, columnIndex }));
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetSection, targetIndex, targetColumnIndex) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const id = e.dataTransfer.getData('id');

    const newComponents = JSON.parse(JSON.stringify(components));

    const insertComponent = (components, index, columnIndex, component) => {
      if (columnIndex !== undefined) {
        const indices = index.toString().split('-').map(Number);
        let current = components;

        for (let i = 0; i < indices.length - 1; i++) {
          if (!current[indices[i]]) {
            console.error(`Invalid path: components[${indices[i]}] is not defined.`);
            return;
          }
          if (columnIndex !== undefined && current[indices[i]].columns) {
            current = current[indices[i]].columns[columnIndex];
          } else {
            current = current[indices[i]];
          }
        }

        const lastIndex = indices[indices.length - 1];

        if (!current[lastIndex]) {
          current[lastIndex] = { columns: [[], []] };
        } else if (!current[lastIndex].columns) {
          current[lastIndex].columns = [[], []];
        }

        current[lastIndex].columns[columnIndex].push(component);
      } else {
        components.splice(index, 0, component);
      }
    };


    if (type && id) {
      // New component being added
      const newComponent = { type, id };
      if (type === COMPONENT_TYPES.PARAGRAPH) {
        newComponent.text = 'This is a new paragraph.';
      }
      if (type === COMPONENT_TYPES.H1) {
        newComponent.text = 'Heading';
      }
      if (type === COMPONENT_TYPES.TWO_COLUMN) {
        newComponent.columns = [[], []];
      }

      insertComponent(newComponents[targetSection], targetIndex, targetColumnIndex, newComponent);
    } else if (draggingIndex) {
      // Existing component being moved
      let draggedComponent;

      const removeComponent = (components, index, columnIndex) => {
        if (columnIndex !== undefined) {
          const indices = index.toString().split('-').map(Number);
          let current = components;
          for (let i = 0; i < indices.length - 1; i++) {
            if (columnIndex !== undefined && current[indices[i]].columns) {
              current = current[indices[i]].columns[columnIndex];
            } else {
              current = current[indices[i]];
            }
          }
          draggedComponent = current.splice(indices[indices.length - 1], 1)[0];
        } else {
          draggedComponent = components.splice(index, 1)[0];
        }
      };

      removeComponent(newComponents[draggingIndex.section], draggingIndex.index, draggingIndex.columnIndex);

      insertComponent(newComponents[targetSection], targetIndex, targetColumnIndex, draggedComponent);
    }

    updateComponents(newComponents);
    setDraggingIndex(null);
  };


  const parseComponents = (code, section) => {
    const components = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');

    const parseElement = (element) => {
      if (element.tagName === 'P') {
        return {
          type: COMPONENT_TYPES.PARAGRAPH,
          text: element.textContent,
          id: `${section}-${components.length}`,
        };
      } else if (element.tagName === 'H1') {
        return {
          type: COMPONENT_TYPES.H1,
          text: element.textContent,
          id: `${section}-${components.length}`,
        };
      } else if (element.tagName === 'BUTTON') {
        return {
          type: COMPONENT_TYPES.BUTTON,
          text: element.textContent,
          id: `${section}-${components.length}`,
        };
      } else if (element.classList.contains('two-column-layout')) {
        const columns = Array.from(element.children).map(column =>
          Array.from(column.children).map(parseElement)
        );
        return {
          type: COMPONENT_TYPES.TWO_COLUMN,
          columns,
          id: `${section}-${components.length}`,
        };
      }
      return null;
    };

    Array.from(doc.body.children).forEach(element => {
      const component = parseElement(element);
      if (component) {
        components.push(component);
      }
    });

    return components;
  };

  const handleSourceCodeChange = (section, e) => {
    const newCode = e.target.value;

    setSourceCode(prevSourceCode => ({
      ...prevSourceCode,
      [section]: newCode
    }));

    const newComponents = parseComponents(newCode, section);

    setComponents(prevComponents => ({
      ...prevComponents,
      [section]: newComponents
    }));

    // Update the undo stack
    setUndoStack(prevUndoStack => [...prevUndoStack, components]);
    setRedoStack([]);
  };

  const updateSourceCode = (updatedComponents) => {
    const generateCode = (sectionComponents) =>
      sectionComponents
        .map(component => {
          if (component.type === COMPONENT_TYPES.PARAGRAPH) {
            return `<p>${component.text || ''}</p>`;
          }
          if (component.type === COMPONENT_TYPES.BUTTON) {
            return `<button>${component.text || ''}</button>`;
          }
          if (component.type === COMPONENT_TYPES.H1) {
            return `<h1>${component.text || ''}</h1>`;
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
      description: generateCode(updatedComponents.description),
      about: generateCode(updatedComponents.about)
    };

    setSourceCode(newSourceCode);
  };
  const clearEditor = () => {
    setComponents({ description: [], about: [] });
    setSourceCode({ description: '', about: '' });
    setUndoStack([]);
    setRedoStack([]);
  };
  const undo = () => {
    if (undoStack.length === 0) return;

    const previousComponents = undoStack.pop();
    setRedoStack([...redoStack, components]);
    setComponents(previousComponents);
    updateSourceCode(previousComponents);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const nextComponents = redoStack.pop();
    setUndoStack([...undoStack, components]);
    setComponents(nextComponents);
    updateSourceCode(nextComponents);
  };

  const renderComponent = (component, section, index, columnIndex) => {
    const isDragging = draggingIndex &&
      draggingIndex.section === section &&
      draggingIndex.index === index &&
      draggingIndex.columnIndex === columnIndex;

    const handleTextChange = (e) => {
      const newComponents = JSON.parse(JSON.stringify(components));
      if (columnIndex !== undefined) {
        const [parentIndex, childIndex] = index.split('-').map(Number);
        newComponents[section][parentIndex].columns[columnIndex][childIndex].text = e.target.value;
      } else {
        newComponents[section][index].text = e.target.value;
      }
      updateComponents(newComponents);
    };

    return (
      <div
        key={`${component.id}-${columnIndex}`}
        data-index={index}
        style={{
          marginBottom: '10px',
          cursor: 'move',
          opacity: isDragging ? 0.5 : 1,
          border: isDragging ? '1px dashed #000' : 'none',
          padding: '8px',
        }}
        onDragStart={(e) => onDragStart(e, section, index, columnIndex)}
        onDragOver={onDragOver}
        onDrop={(e) => {
          e.stopPropagation();
          onDrop(e, section, index, columnIndex);
        }}
        draggable
      >
        {component.type === COMPONENT_TYPES.PARAGRAPH && (
          <div style={{ position: 'relative' }}>
            <Typography
              variant="body1"
              onClick={() => setEditingIndex({ section, index, columnIndex })}
              style={{
                padding: '4px',
                border: 'none',
                boxShadow: 'none',
                whiteSpace: 'pre-wrap',
                visibility: editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex ? 'hidden' : 'visible',
              }}
            >
              {component.text || 'This is a paragraph.'}
            </Typography>
            {editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex && (
              <TextField
                fullWidth
                multiline
                value={component.text || ''}
                onChange={handleTextChange}
                onBlur={() => setEditingIndex({ section: null, index: null, columnIndex: null })}
                autoFocus
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'transparent',
                  border: 'none',
                }}
                InputProps={{
                  style: {
                    backgroundColor: 'transparent',
                  },
                }}
              />
            )}
          </div>
        )}
        {component.type === COMPONENT_TYPES.H1 && (
          <div style={{ position: 'relative' }}>
            <Typography
              variant="body1"
              onClick={() => setEditingIndex({ section, index, columnIndex })}
              style={{
                fontSize: '34px',
                padding: '4px',
                border: 'none',
                boxShadow: 'none',
                whiteSpace: 'pre-wrap',
                visibility: editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex ? 'hidden' : 'visible',
              }}
            >
              {component.text || 'Heading'}
            </Typography>
            {editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex && (
              <TextField
                fullWidth
                multiline
                value={component.text || ''}
                onChange={handleTextChange}
                onBlur={() => setEditingIndex({ section: null, index: null, columnIndex: null })}
                autoFocus
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'transparent',
                  border: 'none',
                }}
                InputProps={{
                  style: {
                    backgroundColor: 'transparent',
                  },
                }}
              />
            )}
          </div>
        )}
        {component.type === COMPONENT_TYPES.BUTTON && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => setEditingIndex({ section, index, columnIndex })}
          >
            {component.text || 'Button'}
          </Button>
        )}
        {component.type === COMPONENT_TYPES.TWO_COLUMN && (
          <Box
            key={component.id}
            display="flex"
            justifyContent="space-between"
            style={{ minHeight: '200px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
          >
            {component.columns.map((column, colIndex) => (
              <Box
                key={`${component.id}-col-${colIndex}`}
                flex={1}
                p={1}
                border={1}
                borderColor="grey.300"
                borderRadius={2}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDrop(e, section, index, colIndex);
                }}
                style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {column.map((nestedComponent, nestedIndex) =>
                  renderComponent(nestedComponent, section, `${index}-${nestedIndex}`, colIndex)
                )}
              </Box>
            ))}
          </Box>
        )}
      </div>
    );
  };

  // ... (other functions remain the same)

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
        <Button
          variant="contained"
          onClick={toggleSidebar}
          style={{ marginLeft: '10px' }}
        >
          {sidebarOpen ? 'Close Element' : '+ Add Element'}
        </Button>
        <Box display="flex" justifyContent="flex-end" style={{ flexGrow: 1 }}>
          <Button size="small" variant="contained" onClick={undo} disabled={undoStack.length === 0} style={{ marginLeft: '10px' }}>
            <Icon icon="lucide:undo" width="24" height="24" />
          </Button>
          <Button size="small" variant="contained" onClick={redo} disabled={redoStack.length === 0} style={{ marginLeft: '10px' }}>
            <Icon icon="lucide:redo" width="24" height="24" />
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowSource(!showSource)}
            style={{ marginLeft: '10px' }}
          >
            {showSource ? 'Text View' : 'Code View'}
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column">
        <Box display="flex" mb={2}>
          {/* Editor Area */}
          <Box
            flex={2}
            p={2}
            border={1}
            borderColor="grey.300"
            borderRadius={2}
            display="flex"
            position="relative" // Allow positioning of CloseIcon
          >
            <IconButton
              size="small"
              onClick={clearEditor}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
            >
              <Icon icon="ic:baseline-close" width="24" height="24" />
            </IconButton>
            <Box flex={2} mr={2}>
              <Typography variant="h6" mb={2}>Description</Typography>
              <hr style={{ marginTop: '10px', border: 'none', borderTop: '2px solid #ddd' }} />
              {!showSource ? (
                <Box
                  flex={1}
                  p={2}
                  borderRadius={2}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, 'description', components.description.length)}
                  style={{ minHeight: '400px' }}
                >
                  {components.description.map((component, index) => renderComponent(component, 'description', index))}
                </Box>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  value={sourceCode.description}
                  onChange={(e) => handleSourceCodeChange('description', e)}
                  rows={20}
                  style={{ borderRadius: '4px' }}
                />
              )}
            </Box>
            <Box flex={1}>
              <Typography variant="h6" mb={2}>About</Typography>
              <hr style={{ marginTop: '10px', border: 'none', borderTop: '2px solid #ddd' }} />
              {!showSource ? (
                <Box
                  flex={1}
                  p={2}
                  borderRadius={2}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, 'about', components.about.length)}
                  style={{ minHeight: '400px' }}
                >
                  {components.about.map((component, index) => renderComponent(component, 'about', index))}
                </Box>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  value={sourceCode.about}
                  onChange={(e) => handleSourceCodeChange('about', e)}
                  rows={20}
                  style={{ borderRadius: '4px' }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Sidebar */}
      {/* Custom Movable Sidebar with Close Button */}
      {sidebarOpen && (
        <Box
          ref={sidebarRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'fixed',
            left: sidebarPosition.x,
            top: sidebarPosition.y,
            width: '350px',
            backgroundColor: '#f5f5f5',
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            overflowY: 'auto',
          }}
        >
          <Box className="handle" p={2} bgcolor="grey.100" style={{ cursor: 'move', position: 'relative' }}>
            <hr style={{ marginTop: '-5px', width: '120px', border: 'none', borderTop: '4px solid #ddd' }} />
            <Typography variant="h7"><strong>Add Element</strong></Typography>
            <IconButton
              aria-label="close"
              onClick={toggleSidebar}
              style={{
                position: 'absolute',
                right: 8,
                top: 12,
              }}
            >
              <Icon icon="ic:baseline-close" width="24" height="24" />
            </IconButton>
          </Box>
          <Box p={2}>
            <Typography variant="body2" style={{ fontSize: '18px', color: 'black', marginBottom: '10px', marginTop: '10px' }}>
              Basics
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.PARAGRAPH);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="mdi:text" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  Text
                </Typography>
              </Button>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.BUTTON);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="fluent:button-16-regular" width="40" height="" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  Button
                </Typography>
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.TWO_COLUMN);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="mingcute:columns-2-line" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  2 Column
                </Typography>
              </Button>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.BUTTON);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="akar-icons:square" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  1 Column
                </Typography>
              </Button>
            </div>
            <Typography variant="body2" style={{ fontSize: '18px', color: 'black', marginBottom: '10px', marginTop: '10px' }}>
              Text
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.H1);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="mdi:newspaper-variant-outline" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  H1
                </Typography>
              </Button>

              <Button
                variant="outlined"
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', COMPONENT_TYPES.H1);
                  e.dataTransfer.setData('id', Date.now().toString());
                }}
                draggable
                style={{
                  backgroundColor: 'white',
                  borderColor: '#ebebeb',
                  width: '48%', // Butonların genişliği %48
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                <Icon icon="mdi:newspaper-variant-outline" width="40" height="40" style={{ color: 'grey' }} />
                <Typography variant="body2" style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>
                  H2
                </Typography>
              </Button>
            </div>
          </Box>
        </Box>
      )}

    </Container>
  );
};

export default DragDropEditor;