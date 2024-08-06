import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DragDropEditor from './components/DragDropEditor';

const theme = createTheme({
  // Burada özel tema ayarlarınızı yapabilirsiniz
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DragDropEditor />
    </ThemeProvider>
  );
}

export default App;