// DragDropEditor.js
import React, { useState, useEffect } from 'react';
import { IconButton, Box, Container, Typography, TextField, Button } from '@mui/material';
import Sidebar from './Sidebar';
import EditorArea from './EditorArea';
import Toolbar from './Toolbar';
import { Icon } from '@iconify/react';
import EmailModal from './EmailModal';
import * as BackendService from './BackendService';

const COMPONENT_TYPES = {
  PARAGRAPH: 'paragraph',
  BUTTON: 'button',
  TWO_COLUMN: 'two-column',
  ONE_COLUMN: 'one-column',
  H1: 'h1',
  H2: 'h2',
};
const DragDropEditor = () => {
  const [components, setComponents] = useState({ description: [], about: [] });
  const [sourceCode, setSourceCode] = useState({ description: '', about: '' });
  const [showSource, setShowSource] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [editingIndex, setEditingIndex] = useState({ section: null, index: null });
  const [redoStack, setRedoStack] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState({ x: 0, y: 0 });
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [emailIndex, setEmailIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({});
  const [currentEmailData, setCurrentEmailData] = useState({});

  useEffect(() => {
    loadComponents();
    loadEmailData();
  }, []);

  const handleClose = (section, index) => {
    const newComponents = JSON.parse(JSON.stringify(components));
    newComponents[section] = newComponents[section].filter((_, i) => i !== index);
    updateComponents(newComponents);
  };

  const updateComponents = (newComponents) => {
    setUndoStack([...undoStack, components]);
    setRedoStack([]);
    setComponents(newComponents);
    const newSourceCode = updateSourceCode(newComponents);
    BackendService.saveComponentsToJson(newSourceCode.description);
  };

  const clearEditor = () => {
    setComponents({ description: [], about: [] });
    setSourceCode({ description: '', about: '' });
    setUndoStack([]);
    setRedoStack([]);
  };
  const onDragStart = (e, section, index, columnIndex) => {
    setDraggingIndex({ section, index, columnIndex });
    e.dataTransfer.setData('text/plain', JSON.stringify({ section, index, columnIndex }));
  };

  const loadComponents = async () => {
    try {
      const loadedSourceCode = await BackendService.loadComponentsFromJson();
      setSourceCode({
        description: loadedSourceCode,
        about: sourceCode.about // Mevcut about source code'unu koruyoruz
      });
      const parsedComponents = parseComponents(loadedSourceCode, 'description');
      setComponents({
        description: parsedComponents,
        about: components.about // Mevcut about bileşenlerini koruyoruz
      });
    } catch (error) {
      console.error('Error loading components:', error);
    }
  };

  const loadEmailData = async () => {
    try {
      const loadedEmailData = await BackendService.loadEmailDataFromJson();
      setEmailData(loadedEmailData);
    } catch (error) {
      console.error('Error loading email data:', error);
    }
  };


  const handleOpenModal = (section, index) => {
    const currentData = emailData[section]?.[index] || {};
    setCurrentEmailData(currentData);
    setEmailIndex({ section, index });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEmailData({});
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
      } if (element.tagName === 'H1') {
        return {
          type: COMPONENT_TYPES.H1,
          text: element.textContent,
          id: `${section}-${components.length}`,
        };
      } if (element.tagName === 'H2') {
        return {
          type: COMPONENT_TYPES.H2,
          text: element.textContent,
          id: `${section}-${components.length}`,
        };
      } if (element.tagName === 'BUTTON') {
        return {
          type: COMPONENT_TYPES.BUTTON,
          text: element.textContent,
          id: `${section}-${components.length}`,
        };
      } if (element.classList.contains('two-column-layout')) {
        const columns = Array.from(element.children).map(column =>
          Array.from(column.children).map(parseElement)
        );
        return {
          type: COMPONENT_TYPES.TWO_COLUMN,
          columns: columns.length ? columns : [[], []],
          id: `${section}-${components.length}`,
        };
      }
      if (element.classList.contains('one-column-layout')) {
        const content = Array.from(element.children).map(parseElement);
        return {
          type: COMPONENT_TYPES.ONE_COLUMN,
          content: content || [],
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
            return `<button>${component.text || 'Contact me'}</button>`;
          }
          if (component.type === COMPONENT_TYPES.H1) {
            return `<h1>${component.text || ''}</h1>`;
          }
          if (component.type === COMPONENT_TYPES.H2) {
            return `<h2>${component.text || ''}</h2>`;
          }
          if (component.type === COMPONENT_TYPES.TWO_COLUMN) {
            return `<div class="two-column-layout">
              <div class="column">${generateCode(component.columns[0])}</div>
              <div class="column">${generateCode(component.columns[1])}</div>
            </div>`;
          }
          if (component.type === COMPONENT_TYPES.ONE_COLUMN) {
            return `<div class="one-column-layout">
              ${generateCode(component.content)}
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
    return newSourceCode;
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

        for (let i = 0; i < indices.length; i++) {
          if (i === indices.length - 1) {
            if (!current[indices[i]]) {
              if (current.type === COMPONENT_TYPES.ONE_COLUMN) {
                current.content.push(component);
              } else {
                current[indices[i]] = { type: COMPONENT_TYPES.TWO_COLUMN, columns: [[], []] };
                current[indices[i]].columns[columnIndex].push(component);
              }
            } else if (current[indices[i]].type === COMPONENT_TYPES.ONE_COLUMN) {
              current[indices[i]].content.push(component);
            } else {
              if (!current[indices[i]].columns) {
                current[indices[i]].columns = [[], []];
              }
              current[indices[i]].columns[columnIndex].push(component);
            }
            return;
          }

          if (!current[indices[i]]) {
            current[indices[i]] = { type: COMPONENT_TYPES.TWO_COLUMN, columns: [[], []] };
          }

          if (current[indices[i]].type === COMPONENT_TYPES.TWO_COLUMN) {
            current = current[indices[i]].columns[columnIndex];
          } else if (current[indices[i]].type === COMPONENT_TYPES.ONE_COLUMN) {
            current = current[indices[i]].content;
          } else {
            current = current[indices[i]];
          }
        }
      } else {
        components.splice(index, 0, component);
      }
    };


    if (type && id) {
      // New component being added
      const newComponent = { type, id };
      if (type === COMPONENT_TYPES.PARAGRAPH) {
        newComponent.text = "I'am a text. Click here to add your own text and edit me. It's easy";
      }
      if (type === COMPONENT_TYPES.H1) {
        newComponent.text = 'Heading';
      }
      if (type === COMPONENT_TYPES.H2) {
        newComponent.text = 'Heading';
      }
      if (type === COMPONENT_TYPES.TWO_COLUMN) {
        newComponent.columns = [[], []];
      }
      if (type === COMPONENT_TYPES.ONE_COLUMN) {
        newComponent.content = [];
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
            } else if (current[indices[i]].type === COMPONENT_TYPES.ONE_COLUMN) {
              current = current[indices[i]].content;
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

  const undo = () => {
    if (undoStack.length === 0) return;
    const previousComponents = undoStack.pop();
    setRedoStack([...redoStack, components]);
    setComponents(previousComponents);
    updateSourceCode(previousComponents);
  };


  const handleSaveEmailData = () => {
    const { section, index } = emailIndex;
    const newEmailData = { ...emailData };
    if (!newEmailData[section]) {
      newEmailData[section] = {};
    }
    newEmailData[section][index] = currentEmailData;
    setEmailData(newEmailData);
    BackendService.saveEmailDataToJson(newEmailData);
    handleCloseModal();
  };

  const handleEmailDataChange = (field, value) => {
    setCurrentEmailData(prevData => ({
      ...prevData,
      [field]: value
    }));
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

    const handleTextChange = (e, section, index, columnIndex) => {
      const newComponents = JSON.parse(JSON.stringify(components));
      if (columnIndex !== undefined) {
        const indices = index.split('-').map(Number);
        let current = newComponents[section];
        for (let i = 0; i < indices.length - 1; i++) {
          if (current[indices[i]].type === COMPONENT_TYPES.TWO_COLUMN) {
            current = current[indices[i]].columns[columnIndex];
          } else if (current[indices[i]].type === COMPONENT_TYPES.ONE_COLUMN) {
            current = current[indices[i]].content;
          } else {
            current = current[indices[i]];
          }
        }
        current[indices[indices.length - 1]].text = e.target.value;
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
          <div style={{ position: 'relative', border: editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex ? 'none' : '1px dashed grey', }}>
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
                onChange={(e) => handleTextChange(e, section, index, columnIndex)}
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
              variant="h1"
              onClick={() => setEditingIndex({ section, index, columnIndex })}
              style={{
                padding: '4px',
                border: 'none',
                boxShadow: 'none',
                whiteSpace: 'pre-wrap',
                visibility: editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex ? 'hidden' : 'visible',
              }}
            >
              <p>{component.text || 'Heading 1'}</p>
            </Typography>
            {editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex && (
              <TextField
                fullWidth
                value={component.text || ''}
                onChange={(e) => handleTextChange(e, section, index, columnIndex)}
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
                    fontSize: '2em', // h1 boyutuna eşdeğer yapıyor
                    fontWeight: 'bold',
                    lineHeight: 'normal',
                    margin: 0,
                  },
                }}
              />
            )}
          </div>
        )}

        {component.type === COMPONENT_TYPES.H2 && (
          <div style={{ position: 'relative' }}>
            <Typography
              variant="h2"
              onClick={() => setEditingIndex({ section, index, columnIndex })}
              style={{
                padding: '4px',
                border: 'none',
                boxShadow: 'none',
                whiteSpace: 'pre-wrap',
                visibility: editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex ? 'hidden' : 'visible',
              }}
            >
              {component.text || 'Heading 2'}
            </Typography>
            {editingIndex.section === section && editingIndex.index === index && editingIndex.columnIndex === columnIndex && (
              <TextField
                fullWidth
                value={component.text || ''}
                onChange={(e) => handleTextChange(e, section, index, columnIndex)}
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
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                  },
                }}
              />
            )}
          </div>
        )}
        {component.type === COMPONENT_TYPES.BUTTON && (
          <div
            style={{
              border: '1px dashed grey',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="text"
              component="a"
              href={`mailto:${emailData[section]?.[index]?.email || ''}`}
              style={{
                borderRadius: '10%',
                color: 'black',
                textTransform: 'capitalize',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconButton size="small" variant="contained" style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '10%',
                padding: 10,
                color: 'black',
                marginRight: '15px',
              }}>
                <Icon icon="mdi:plus" width="24" height="24" />
              </IconButton>
              {emailData[section]?.[index]?.buttonText || component.text || 'Contact me'}
            </Button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <IconButton size="small" variant="contained" onClick={() => handleOpenModal(section, index)} style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '15%',
                padding: 10,
                color: 'black',
                marginLeft: '10px'
              }}>
                <Icon icon="fluent:edit-28-filled" width="24" height="24" />
              </IconButton>
              <IconButton size="small" variant="contained" onClick={() => handleClose(section, index)} style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '15%',
                padding: 5,
                color: 'black',
                marginRight: '10px'
              }}>
                <Icon icon="ic:baseline-close" width="24" height="24" />
              </IconButton>
            </div>
          </div>


        )}
        {component.type === COMPONENT_TYPES.TWO_COLUMN && (
          <Box
            key={component.id}
            display="flex"
            justifyContent="space-between"
            style={{ minHeight: '200px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
          >
            {(component.columns || [[], []]).map((column, colIndex) => (
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
                {(column || []).map((nestedComponent, nestedIndex) =>
                  renderComponent(nestedComponent, section, `${index}-${nestedIndex}`, colIndex)
                )}
              </Box>
            ))}
          </Box>
        )}
        {component.type === COMPONENT_TYPES.ONE_COLUMN && (
          <Box
            key={component.id}
            style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px', padding: '10px' }}
          >
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDrop(e, section, index, 0);
              }}
              style={{ minHeight: '100px' }}
            >
              {(component.content || []).map((nestedComponent, nestedIndex) =>
                renderComponent(nestedComponent, section, `${index}-${nestedIndex}`, 0)
              )}
            </Box>
          </Box>
        )}
      </div>
    );
  };

  // ... (other functions remain the same)

  return (
    <Container>
      <Toolbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        undo={undo}
        redo={redo}
        undoStack={undoStack}
        redoStack={redoStack}
        showSource={showSource}
        setShowSource={setShowSource}
      />
      <Box display="flex" flexDirection="column">
        <EditorArea
          components={components}
          showSource={showSource}
          sourceCode={sourceCode}
          handleSourceCodeChange={handleSourceCodeChange}
          onDragOver={onDragOver}
          onDrop={onDrop}
          renderComponent={renderComponent}
          clearEditor={clearEditor}
        />
      </Box>

      {sidebarOpen && (
        <Sidebar
          sidebarPosition={sidebarPosition}
          setSidebarPosition={setSidebarPosition}
          toggleSidebar={() => setSidebarOpen(false)}
          COMPONENT_TYPES={COMPONENT_TYPES}
        />
      )}
      <EmailModal
        open={modalOpen}
        onClose={handleCloseModal}
        currentEmailData={currentEmailData}
        onSave={handleSaveEmailData}
        onChange={handleEmailDataChange}
      />
    </Container>
  );
};

export default DragDropEditor;