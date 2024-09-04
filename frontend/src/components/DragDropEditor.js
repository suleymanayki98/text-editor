import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Box, Container } from '@mui/material';
import Sidebar from './Sidebar';
import EditorArea from './EditorArea';
import Toolbar from './Toolbar';
import EmailModal from './EmailModal';
import * as BackendService from './BackendService';
import { Snackbar, Alert } from '@mui/material';
import { COMPONENT_TYPES, elementConfig } from './constants';
import ParagraphComponent from './elements/ParagraphComponent';
import HeadingComponent from './elements/HeadingComponent';
import HeadingComponent2 from './elements/HeadingComponent2';
import ButtonComponent from './elements/ButtonComponent';
import TwoColumnComponent from './elements/TwoColumnComponent';
import OneColumnComponent from './elements/OneColumnComponent';

const ComponentWrapper = styled.div`
  margin-bottom: 0.625rem;
  cursor: move;
  padding: 0.5rem;
  ${props => props.isDragging && `
    opacity: 0.5;
    border: 1px dashed black;
  `}
`;

const DragIndicator = styled.div`
  position: fixed;
  width: 400px;
  height: 4px;
  background-color: #0000FF;
  pointer-events: none;
  z-index: 50;
  transition: all 50ms linear;
`;
const DragDropEditor = () => {
  const [components, setComponents] = useState({ description: [], about: [] });
  const [sourceCode, setSourceCode] = useState({ description: '', about: '' });
  const [undoRedoState, setUndoRedoState] = useState({
    undoStack: [],
    redoStack: [],
  });
  const [editingState, setEditingState] = useState({
    editingIndex: { section: null, index: null },
    draggingIndex: null,
  });

  const [dragIndicator, setDragIndicator] = useState({
    show: false,
    left: 0,
    top: 0,
    width: 400,
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    emailIndex: null,
    currentEmailData: {},
  });
 
  const [dragState, setDragState] = useState({
    isDragging: false,
    showHr: false,
    mousePosition: { x: 0, y: 0 },
    draggableArea: null,
    editorBounds: null,
    activeColumn: null,
    isDraggingComponent: false,
    sidebarPosition: { x: 0, y: 0 }, // Initialize with default values
  });
  const [uiState, setUiState] = useState({
    sidebarOpen: false,
    showSource: false,
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [emailData, setEmailData] = useState({});
  

  const iconStyle = (hover) => ({
    color: hover ? '#015FFB' : 'black',
  });

  useEffect(() => {
    loadComponents();
    loadEmailData();
  }, []);

  useEffect(() => {
    const editorElement = document.getElementById('editor-area');
    if (editorElement) {
      const bounds = editorElement.getBoundingClientRect();
      setDragState(prevState => ({ ...prevState, editorBounds: bounds }));
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setDragState(prevState => ({ ...prevState, mousePosition: { x: event.clientX, y: event.clientY } }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const updateUndoRedoState = (newState) => {
    setUndoRedoState(prevState => ({ ...prevState, ...newState }));
  };
  const updateEditingState = (newState) => {
    setEditingState(prevState => ({ ...prevState, ...newState }));
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleClose = (e, section, index, columnIndex) => {
    e.stopPropagation(); // Olayın üst elementlere yayılmasını engelle
    const newComponents = JSON.parse(JSON.stringify(components));

    if (columnIndex !== undefined) {
      const indices = index.toString().split('-').map(Number);
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
      current.splice(indices[indices.length - 1], 1);
    } else {
      newComponents[section] = newComponents[section].filter((_, i) => i !== index);
    }

    updateComponents(newComponents);
  };

  const updateComponents = (newComponents) => {
    setUndoRedoState(prevState => ({
      ...prevState,
      undoStack: [...prevState.undoStack, components],
      redoStack: []
    }));
    setComponents(newComponents);
    const newSourceCode = updateSourceCode(newComponents);
    BackendService.saveComponentsToJson(newSourceCode.description)
      .catch((error) => {
        showToast('Error saving components', 'error');
      });
  };

  const clearEditor = () => {
    setComponents({
      description: [],
      about: []
    });

    setSourceCode({
      description: '',
      about: ''
    });

    setUndoRedoState({
      undoStack: [],
      redoStack: []
    });

    setEditingState(prevState => ({
      ...prevState,
      editingIndex: { section: null, index: null, columnIndex: null }
    }));

    BackendService.saveComponentsToJson('');
  };
  const updateDragState = useCallback((newState) => {
    setDragState(prevState => ({
      ...prevState,
      ...(typeof newState === 'function' ? newState(prevState) : newState)
    }));
  }, []);

  const updateModalState = (newState) => {
    setModalState(prevState => ({ ...prevState, ...newState }));
  };

  const updateUiState = (newState) => {
    setUiState(prevState => ({ ...prevState, ...newState }));
  };

  const onDragStart = (e, section, index, columnIndex) => {
    e.stopPropagation();
    updateEditingState({ draggingIndex: { section, index, columnIndex } });
    e.dataTransfer.setData('text/plain', JSON.stringify({ section, index, columnIndex }));
    updateDragState({
      isDragging: true,
      showHr: true,
      isDraggingComponent: true
    });
  };

  

  const loadComponents = async () => {
    try {
      const loadedSourceCode = await BackendService.loadComponentsFromJson();
      setSourceCode({
        description: loadedSourceCode,
        about: sourceCode.about
      });
      const parsedComponents = parseComponents(loadedSourceCode, 'description');
      setComponents({
        description: parsedComponents,
        about: components.about
      });
      showToast('Components loaded successfully', 'success');
    } catch (error) {
      showToast('Error loading components', 'error');
    }
  };
  const loadEmailData = async () => {
    try {
      const loadedEmailData = await BackendService.loadEmailDataFromJson();
      setEmailData(loadedEmailData);
      showToast('Email data loaded successfully', 'success');
    } catch (error) {
      showToast('Error loading email data', 'error');
    }
  };


  const handleOpenModal = (section, index) => {
    const currentData = emailData[section]?.[index] || {};
    updateModalState({
      isOpen: true,
      emailIndex: { section, index },
      currentEmailData: currentData,
    });
  };

  const handleCloseModal = () => {
    updateModalState({
      isOpen: false,
      currentEmailData: {},
    });
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

    // Update the undo/redo state
    setUndoRedoState(prevState => ({
      undoStack: [...prevState.undoStack, components],
      redoStack: []
    }));
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
            return `<h1 class="${component.className || 'text-4xl font-bold leading-normal m-0'}">${component.text || ''}</h1>`;
          }
          if (component.type === COMPONENT_TYPES.H2) {
            return `<h2 class="${component.className || 'text-3xl font-bold leading-normal m-0'}">${component.text || ''}</h2>`;
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
  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const onDragOver = useCallback((e, section, index, columnIndex) => {
    e.preventDefault();
    e.stopPropagation();
  
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const threshold = rect.height / 2;
  
    setDragIndicator({
      show: true,
      left: rect.left,
      top: mouseY > threshold ? rect.bottom : rect.top,
      width: rect.width,
    });
  
    updateDragState({
      mousePosition: { x: e.clientX, y: e.clientY },
      activeColumn: columnIndex !== undefined ? { left: rect.left, width: rect.width } : null,
    });
  }, []);


  const onDragEnd = () => {
    updateDragState({
      showHr: false,
      isDragging: false,
      isDraggingComponent: false
    });
  };

  
  // Helper functions
  const createNewComponent = (type, id) => ({
    type,
    id,
    ...elementConfig[type]
  });
  
  const removeComponent = (components, section, index, columnIndex) => {
    if (columnIndex !== undefined) {
      const indices = index.toString().split('-').map(Number);
      let current = components[section];
      for (let i = 0; i < indices.length - 1; i++) {
        if (current[indices[i]].type === COMPONENT_TYPES.TWO_COLUMN) {
          current = current[indices[i]].columns[columnIndex];
        } else if (current[indices[i]].type === COMPONENT_TYPES.ONE_COLUMN) {
          current = current[indices[i]].content;
        } else {
          current = current[indices[i]];
        }
      }
      return current.splice(indices[indices.length - 1], 1)[0];
    } else {
      return components[section].splice(index, 1)[0];
    }
  };
  
  const insertComponent = (components, section, index, columnIndex, component) => {
    if (columnIndex !== undefined) {
      const indices = index.toString().split('-').map(Number);
      let current = components[section];
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
      components[section].splice(index, 0, component);
    }
  };
  
 const onDrop = useCallback((e, targetSection, targetIndex, targetColumnIndex) => {
  e.preventDefault();
  e.stopPropagation();

  updateDragState({
    showHr: false,
    isDragging: false,
  });

  setDragIndicator({ show: false });

  const type = e.dataTransfer.getData('type');
  const id = e.dataTransfer.getData('id');
  const draggedData = e.dataTransfer.getData('text/plain');

  const newComponents = JSON.parse(JSON.stringify(components));

  if (type && id) {
    const newComponent = createNewComponent(type, id);
    insertComponent(newComponents, targetSection, targetIndex, targetColumnIndex, newComponent);
  } else if (draggedData) {
    const { section: sourceSection, index: sourceIndex, columnIndex: sourceColumnIndex } = JSON.parse(draggedData);
    const draggedComponent = removeComponent(newComponents, sourceSection, sourceIndex, sourceColumnIndex);
    insertComponent(newComponents, targetSection, targetIndex, targetColumnIndex, draggedComponent);
  }

  updateComponents(newComponents);
  updateEditingState({ draggingIndex: null });
}, [components]);
  const undo = () => {
    if (undoRedoState.undoStack.length === 0) return;
    const previousComponents = undoRedoState.undoStack[undoRedoState.undoStack.length - 1];
    setUndoRedoState(prevState => ({
      undoStack: prevState.undoStack.slice(0, -1),
      redoStack: [...prevState.redoStack, components]
    }));
    setComponents(previousComponents);
    updateSourceCode(previousComponents);
  };


  const handleSaveEmailData = () => {
    const { section, index } = modalState.emailIndex;
    const newEmailData = { ...emailData };
    if (!newEmailData[section]) {
      newEmailData[section] = {};
    }
    newEmailData[section][index] = modalState.currentEmailData;
    setEmailData(newEmailData);

    const newComponents = JSON.parse(JSON.stringify(components));
    if (newComponents[section] && newComponents[section][index]) {
      newComponents[section][index].backgroundColor = modalState.currentEmailData.backgroundColor;
    }
    setComponents(newComponents);

    BackendService.saveEmailDataToJson(newEmailData)
      .then(() => {
        showToast('Email data saved successfully', 'success');
        handleCloseModal();
      })
      .catch((error) => {
        showToast('Error saving email data', 'error');
      });
  };

  const handleEmailDataChange = (field, value) => {
    updateModalState({
      currentEmailData: { ...modalState.currentEmailData, [field]: value }
    });
  };

  const redo = () => {
    if (undoRedoState.redoStack.length === 0) return;
    const nextComponents = undoRedoState.redoStack[undoRedoState.redoStack.length - 1];
    setUndoRedoState(prevState => ({
      undoStack: [...prevState.undoStack, components],
      redoStack: prevState.redoStack.slice(0, -1)
    }));
    setComponents(nextComponents);
    updateSourceCode(nextComponents);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragIndicator({ show: false });
    setDragState(prevState => ({ ...prevState, draggableArea: null }));
  };

  const handleTextChange = useCallback((e, section, index, columnIndex) => {
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
  }, [components]);
  const renderComponent = useCallback((component, section, index, columnIndex) => {
    const isDragging = editingState.draggingIndex &&
      editingState.draggingIndex.section === section &&
      editingState.draggingIndex.index === index &&
      editingState.draggingIndex.columnIndex === columnIndex;

    return (
      <ComponentWrapper
        key={`${component.id}-${columnIndex}`}
        data-index={index}
        isDragging={isDragging}
        onDragStart={(e) => onDragStart(e, section, index, columnIndex)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => onDragOver(e, section, index, columnIndex)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, section, index, columnIndex)}
        draggable
      >
        {component.type === COMPONENT_TYPES.PARAGRAPH && (
          <ParagraphComponent
            component={component}
            section={section}
            index={index}
            columnIndex={columnIndex}
            editingIndex={editingState.editingIndex}
            setEditingIndex={(newIndex) => setEditingState(prevState => ({ ...prevState, editingIndex: newIndex }))}
            handleTextChange={handleTextChange}
          />
        )}

        {(component.type === COMPONENT_TYPES.H1) && (
          <HeadingComponent
            component={component}
            section={section}
            index={index}
            columnIndex={columnIndex}
            editingIndex={editingState.editingIndex}
            setEditingIndex={(newIndex) => setEditingState(prevState => ({ ...prevState, editingIndex: newIndex }))}
            handleTextChange={handleTextChange}
          />
        )}
        {(component.type === COMPONENT_TYPES.H2) && (
          <HeadingComponent2
            component={component}
            section={section}
            index={index}
            columnIndex={columnIndex}
            editingIndex={editingState.editingIndex}
            setEditingIndex={(newIndex) => setEditingState(prevState => ({ ...prevState, editingIndex: newIndex }))}
            handleTextChange={handleTextChange}
          />
        )}

        {component.type === COMPONENT_TYPES.BUTTON && (
          <ButtonComponent
            component={component}
            section={section}
            index={index}
            columnIndex={columnIndex}
            emailData={emailData}
            handleOpenModal={handleOpenModal}
            handleClose={handleClose}
          />
        )}

        {component.type === COMPONENT_TYPES.TWO_COLUMN && (
          <TwoColumnComponent
            component={component}
            section={section}
            index={index}
            onDrop={onDrop}
            setActiveColumn={(column) => setDragState(prevState => ({ ...prevState, activeColumn: column }))}
            setMousePosition={(position) => setDragState(prevState => ({ ...prevState, mousePosition: position }))}
            setShowHr={(show) => setDragState(prevState => ({ ...prevState, showHr: show }))}
            setIsDragging={(dragging) => setDragState(prevState => ({ ...prevState, isDragging: dragging }))}
            renderComponent={renderComponent}
          />
        )}

        {component.type === COMPONENT_TYPES.ONE_COLUMN && (
          <OneColumnComponent
            component={component}
            section={section}
            index={index}
            setActiveColumn={(column) => setDragState(prevState => ({ ...prevState, activeColumn: column }))}
            setIsDragging={(dragging) => setDragState(prevState => ({ ...prevState, isDragging: dragging }))}
            setMousePosition={(position) => setDragState(prevState => ({ ...prevState, mousePosition: position }))}
            setShowHr={(show) => setDragState(prevState => ({ ...prevState, showHr: show }))}
            onDrop={onDrop}
            renderComponent={renderComponent}
          />
        )}
      </ComponentWrapper>
    );
  }, [editingState, onDragStart, onDragEnd, onDragOver, onDrop, handleTextChange, handleOpenModal, handleClose, emailData]);

 
  function updateSidebarPosition(newPosition) {
    setDragState(prevState => ({
      ...prevState,
      sidebarPosition: newPosition
    }));
  }

  return (
    <Container>
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={hideToast}>
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
      <Toolbar
        toggleSidebar={() => updateUiState({ sidebarOpen: !uiState.sidebarOpen })}
        sidebarOpen={uiState.sidebarOpen}
        undo={undo}
        redo={redo}
        undoStack={undoRedoState.undoStack}
        redoStack={undoRedoState.redoStack}
        showSource={uiState.showSource}
        setShowSource={(show) => updateUiState({ showSource: show })}
      />
      <Box display="flex" flexDirection="column">
        <EditorArea
          components={components}
          showSource={uiState.showSource}
          sourceCode={sourceCode}
          handleSourceCodeChange={handleSourceCodeChange}
          onDragOver={onDragOver}
          onDrop={onDrop}
          renderComponent={renderComponent}
          clearEditor={clearEditor}
          setEditorBounds={(bounds) => updateDragState({ editorBounds: bounds })}
        />
      </Box>
      {uiState.sidebarOpen && (
        <Sidebar
          sidebarPosition={dragState.sidebarPosition}
          setSidebarPosition={(position) => setDragState(prevState => ({
            ...prevState,
            sidebarPosition: position
          }))}
          toggleSidebar={() => setUiState(prevState => ({ ...prevState, sidebarOpen: !prevState.sidebarOpen }))}
          COMPONENT_TYPES={COMPONENT_TYPES}
        />
      )}
      <EmailModal
        open={modalState.isOpen}
        onClose={handleCloseModal}
        currentEmailData={modalState.currentEmailData}
        onSave={handleSaveEmailData}
        onChange={handleEmailDataChange}
      />
       {dragIndicator.show && (
        <DragIndicator
          style={{
            left: `${dragIndicator.left}px`,
            top: `${dragIndicator.top}px`,
            width: `${dragIndicator.width}px`,
          }}
        />
      )}
    </Container>
  );
};

export default DragDropEditor;