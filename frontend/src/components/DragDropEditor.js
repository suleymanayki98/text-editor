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

const DragDropEditor = () => {
  const [components, setComponents] = useState({ description: [], about: [] });
  const [sourceCode, setSourceCode] = useState({ description: '', about: '' });
  const [showSource, setShowSource] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [editingIndex, setEditingIndex] = useState({ section: null, index: null });
  const [redoStack, setRedoStack] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [emailIndex, setEmailIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({});
  const [currentEmailData, setCurrentEmailData] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showHr, setShowHr] = useState(false);
  const [draggableArea, setDraggableArea] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editorBounds, setEditorBounds] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [isDraggingComponent, setIsDraggingComponent] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const [editorState, setEditorState] = useState({
    mousePosition: { x: 0, y: 0 },
    sidebarPosition: { x: 0, y: 0 },
  });

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
      setEditorBounds(bounds);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    setUndoStack([...undoStack, components]);
    setRedoStack([]);
    setComponents(newComponents);
    const newSourceCode = updateSourceCode(newComponents);
    BackendService.saveComponentsToJson(newSourceCode.description)
      .catch((error) => {
        showToast('Error saving components', 'error');
      });
  };

  const clearEditor = () => {
    // Bileşenleri boşalt
    setComponents({
      description: [],
      about: []
    });

    // Kaynak kodunu boşalt
    setSourceCode({
      description: '',
      about: ''
    });

    // Geri alma ve ileri alma yığınlarını temizle
    setUndoStack([]);
    setRedoStack([]);

    // Düzenleme indeksini sıfırla
    setEditingIndex({ section: null, index: null, columnIndex: null });

    // Kaydedilen JSON'ı da temizle
    BackendService.saveComponentsToJson('');
  };
  const onDragStart = (e, section, index, columnIndex) => {
    setDraggingIndex({ section, index, columnIndex });
    e.dataTransfer.setData('text/plain', JSON.stringify({ section, index, columnIndex }));
    setIsDragging(true);
    setShowHr(true);
    setIsDraggingComponent(true);  // Yeni eklenen satır
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

  const onDragOver = (e) => {
    e.preventDefault();
    if (!isDraggingComponent) {  // Yeni eklenen kontrol
      setShowHr(true);
    }
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  const DragIndicator = ({ mousePosition, show, editorBounds, isDragging, activeColumn, isDraggingComponent }) => {
    if (!show || !editorBounds || (!isDragging && !isDraggingComponent)) return null;

    const isWithinEditor =
      mousePosition.y >= editorBounds.top &&
      mousePosition.y <= editorBounds.bottom &&
      mousePosition.x >= editorBounds.left &&
      mousePosition.x <= editorBounds.right;

    if (!isWithinEditor) return null;

    let indicatorStyle = {
      position: 'fixed',
      left: `${mousePosition.x}px`,
      top: `${mousePosition.y}px`,
      width: '400px',
      height: '4px',
      backgroundColor: '#0000FF',
      pointerEvents: 'none',
      zIndex: 50,
      transition: 'all 50ms linear',
    };

    if (activeColumn) {
      indicatorStyle.left = `${Math.max(activeColumn.left, Math.min(mousePosition.x, activeColumn.left + activeColumn.width - 400))}px`;
      if (parseFloat(indicatorStyle.left) + 400 > activeColumn.left + activeColumn.width) {
        indicatorStyle.width = `${activeColumn.left + activeColumn.width - parseFloat(indicatorStyle.left)}px`;
      }
    }

    return <div style={indicatorStyle} />;
  };


  const onDragEnd = () => {
    setShowHr(false);
    setIsDragging(false);
    setIsDraggingComponent(false);  // Yeni eklenen satır
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
  
  // Main onDrop function
  const onDrop = useCallback((e, targetSection, targetIndex, targetColumnIndex) => {
    e.preventDefault();
    setShowHr(false);
    setIsDragging(false);
  
    const type = e.dataTransfer.getData('type');
    const id = e.dataTransfer.getData('id');
  
    const newComponents = JSON.parse(JSON.stringify(components));
  
    if (type && id) {
      const newComponent = createNewComponent(type, id);
      insertComponent(newComponents, targetSection, targetIndex, targetColumnIndex, newComponent);
    } else if (draggingIndex) {
      const draggedComponent = removeComponent(newComponents, draggingIndex.section, draggingIndex.index, draggingIndex.columnIndex);
      insertComponent(newComponents, targetSection, targetIndex, targetColumnIndex, draggedComponent);
    }
  
    updateComponents(newComponents);
    setDraggingIndex(null);
  }, [components, draggingIndex, updateComponents]);

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

    // Komponenti güncelle
    const newComponents = JSON.parse(JSON.stringify(components));
    if (newComponents[section] && newComponents[section][index]) {
      newComponents[section][index].backgroundColor = currentEmailData.backgroundColor;
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
  }, [components, updateComponents]);

  const renderComponent = useCallback((component, section, index, columnIndex) => {
    const isDragging = draggingIndex &&
      draggingIndex.section === section &&
      draggingIndex.index === index &&
      draggingIndex.columnIndex === columnIndex;

    return (
      <ComponentWrapper
        key={`${component.id}-${columnIndex}`}
        data-index={index}
        isDragging={isDragging}
        onDragStart={(e) => {
          onDragStart(e, section, index, columnIndex);
          setShowHr(true);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setDraggableArea(rect);
          onDragOver(e, section, index, columnIndex);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDraggableArea(null);
        }}
        onDrop={(e) => {
          e.stopPropagation();
          onDrop(e, section, index, columnIndex);
        }}
        draggable
      >
        {component.type === COMPONENT_TYPES.PARAGRAPH && (
          <ParagraphComponent
            component={component}
            section={section}
            index={index}
            columnIndex={columnIndex}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
            handleTextChange={handleTextChange}
          />
        )}

        {(component.type === COMPONENT_TYPES.H1) && (
          <HeadingComponent
            component={component}
            section={section}
            index={index}
            columnIndex={columnIndex}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
            handleTextChange={handleTextChange}
          />
        )}
        {(component.type === COMPONENT_TYPES.H2) && (
          <HeadingComponent2
            component={component}
            section={section}
            index={index}
            columnIndex={columnIndex}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
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
            setActiveColumn={setActiveColumn}
            setMousePosition={setMousePosition}
            setShowHr={setShowHr}
            setIsDragging={setIsDragging}
            renderComponent={renderComponent}
          />
        )}

        {component.type === COMPONENT_TYPES.ONE_COLUMN && (
          <OneColumnComponent
            component={component}
            section={section}
            index={index}
            setActiveColumn={setActiveColumn}
            setIsDragging={setIsDragging}
            setMousePosition={setMousePosition}
            setShowHr={setShowHr}
            onDrop={onDrop}
            renderComponent={renderComponent}
          />
        )}
      </ComponentWrapper>
    );
  }, [components, editingIndex, emailData, handleClose, handleOpenModal, handleTextChange, setEditingIndex, onDragStart, onDragEnd, onDragOver, onDrop]);

 
  function updateSidebarPosition(newPosition) {
    setEditorState(prevState => ({
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
          setEditorBounds={setEditorBounds}
        />
      </Box>

      {sidebarOpen && (
        <Sidebar
        sidebarPosition={editorState.sidebarPosition}
        setSidebarPosition={updateSidebarPosition}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
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
       <DragIndicator
        mousePosition={mousePosition}
        show={showHr}
        editorBounds={editorBounds}
        isDragging={isDragging}
        activeColumn={activeColumn}
        isDraggingComponent={isDraggingComponent}
      />
    </Container>
  );
};

export default DragDropEditor;