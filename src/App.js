import React from 'react';
import './App.css';
import AppRouter from './router/AppRouter';
import { ImagePreviewProvider } from './context/ImagePreviewContext';
import GlobalImagePreview from './components/common/GlobalImagePreview';

function App() {
  return (
    <ImagePreviewProvider>
      <div className="App">
        <AppRouter />
        <GlobalImagePreview />
      </div>
    </ImagePreviewProvider>
  );
}

export default App;
