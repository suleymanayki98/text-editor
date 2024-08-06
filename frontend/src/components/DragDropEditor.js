// DragDropEditor.js
import React, { useState, useEffect } from 'react';
import { IconButton, Box, Container, Typography, TextField, Button, Modal } from '@mui/material';
import Sidebar from './Sidebar';
import EditorArea from './EditorArea';
import Toolbar from './Toolbar';
import { Icon } from '@iconify/react';
import Grid from '@mui/material/Grid';
import axios from 'axios';

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
    loadComponentsFromJson();
    loadEmailDataFromJson();
  }, []);

  const loadComponentsFromJson = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-components');
      setComponents(response.data);
      updateSourceCode(response.data);
    } catch (error) {
      console.error('Error loading components:', error);
    }
  };

  const updateComponents = (newComponents) => {
    setUndoStack([...undoStack, components]);
    setRedoStack([]);
    setComponents(newComponents);
    updateSourceCode(newComponents);
    saveComponentsToJson(newComponents);
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

  const saveComponentsToJson = async (componentsData) => {
    try {
      await axios.post('http://localhost:5000/api/save-components', { components: componentsData });
      console.log('Components saved successfully');
    } catch (error) {
      console.error('Error saving components:', error);
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
    console.log(code)
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
      } else if (element.tagName === 'H2') {
        return {
          type: COMPONENT_TYPES.H2,
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
        console.log(columns)
        return {
          type: COMPONENT_TYPES.TWO_COLUMN,
          columns,
          id: `${section}-${components.length}`,
        };
      } else if (element.classList.contains('one-column-layout')) {
        const column = Array.from(element.children).map(parseElement);
        return {
          type: COMPONENT_TYPES.ONE_COLUMN,
          column,
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
      console.log(sourceCode)
      console.log(sourceCode)
      if (columnIndex !== undefined) {
        const indices = index.toString().split('-').map(Number);
        let current = components;
        console.log(columnIndex)

        for (let i = 0; i < indices.length; i++) {
          if (i === indices.length - 1) {
            // Son indekse ulaştığımızda, komponenti ekliyoruz
            if (!current[indices[i]]) {
              current[indices[i]] = { type: COMPONENT_TYPES.TWO_COLUMN, columns: [[], []] };
            }
            if (!current[indices[i]].columns) {
              current[indices[i]].columns = [[], []];
            }
            current[indices[i]].columns[columnIndex].push(component);
            return;
          }

          if (!current[indices[i]]) {
            current[indices[i]] = { type: COMPONENT_TYPES.TWO_COLUMN, columns: [[], []] };
          }

          if (current[indices[i]].type === COMPONENT_TYPES.TWO_COLUMN) {
            current = current[indices[i]].columns[columnIndex];
          } else {
            current = current[indices[i]];
          }
        }
      } else {
        // Eğer columnIndex tanımlı değilse, index pozisyonuna ekle
        components.splice(index, 0, component);
      }
    };
    console.log(newComponents)


    if (type && id) {
      // New component being added
      const newComponent = { type, id };
      if (type === COMPONENT_TYPES.PARAGRAPH) {
        newComponent.text = 'This is a new paragraph.';
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

  const loadEmailDataFromJson = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-email-data');
      setEmailData(response.data);
    } catch (error) {
      console.error('Error loading email data:', error);
    }
  };




  const handleSaveEmailData = () => {
    const { section, index } = emailIndex;
    const newEmailData = { ...emailData };
    if (!newEmailData[section]) {
      newEmailData[section] = {};
    }
    newEmailData[section][index] = currentEmailData;
    setEmailData(newEmailData);
    saveEmailDataToJson(newEmailData);
    handleCloseModal();
  };

  const saveEmailDataToJson = async (newEmailData) => {
    try {
      await axios.post('http://localhost:5000/api/save-email-data', { emailData: newEmailData });
      console.log('Email data saved successfully');
    } catch (error) {
      console.error('Error saving email data:', error);
    }
  };

  const handleEmailDataChange = (field, value) => {
    setCurrentEmailData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const renderButtonModal = (section, buttonIndex) => (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          borderRadius: '16px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          p: 3,
        }}
      >
        <h3 id="modal-title">Edit Button</h3>
        <h4>Links</h4>
        <p>You can add social media links or other links to the collection content.</p>
        <Box sx={{
          border: '1px solid',
          borderColor: 'grey.400',
          borderRadius: '8px',
          padding: 10,
          p: 2,
        }}>
          <Grid container spacing={2}>
            <Grid item xs={2} container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
              <IconButton
                size="small"
                variant="outlined"
                style={{ borderRadius: '10%', border: '1px solid #ddd', marginTop: '15px' }}
              >
                <Icon icon="arcticons:mail" width="24" height="24" style={{ color: 'black' }} />
              </IconButton>
              <p>Change Icon</p>
            </Grid>
            <Grid item xs={10}>
              <TextField
                style={{ borderRadius: '20px', margin: '10px' }}
                label="Button Text"
                fullWidth
                variant="outlined"
                value={currentEmailData.buttonText || ''}
                onChange={(e) => handleEmailDataChange('buttonText', e.target.value)}
              />
              <TextField
                style={{ borderRadius: '10px', margin: '10px' }}
                label="Email"
                fullWidth
                variant="outlined"
                value={currentEmailData.email || ''}
                onChange={(e) => handleEmailDataChange('email', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" justifyContent="flex-end" style={{ flexGrow: 1, marginTop: '25px', textTransform: 'capitalize', }}>
          <Button variant="outlined" onClick={handleCloseModal}>Close</Button>
          <Button style={{
            marginLeft: '15px',
          }} variant="contained" color="success" onClick={handleSaveEmailData}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );

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
        {component.type === COMPONENT_TYPES.H2 && (
          <div style={{ position: 'relative' }}>
            <Typography
              variant="body1"
              onClick={() => setEditingIndex({ section, index, columnIndex })}
              style={{
                fontSize: '32px',
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
          <div>
            <Button
              variant="text"
              component="a"
              href={`mailto:${emailData[section]?.[index]?.email || ''}`}
              style={{
                borderRadius: '10%',
                color: 'black',
                textTransform: 'capitalize',
                textDecoration: 'none',
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
            <IconButton size="small" variant="contained" style={{
              borderRadius: '10%',
            }}
              onClick={() => handleOpenModal(section, index)}>
              <Icon icon="pepicons-pop:dots-y" width="24" height="24" style={{ color: 'black' }} />
            </IconButton>
          </div>

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
              {component.content.map((nestedComponent, nestedIndex) =>
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
      {renderButtonModal()}
    </Container>
  );
};

export default DragDropEditor;