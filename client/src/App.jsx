import React, { useState } from 'react';
import './App.css';
import Scheduling from './Scheduling';
import Page from './Page';

function App() {
  const [mode, setMode] = useState(null);

  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
  };

  if (mode === 'Scheduling') {
    return <Scheduling />;
  }

  if (mode === 'PageReplacement') {
    return <Page />;
  }

  return (
    <div className="App">
      <h1>Select Mode</h1>
      <button onClick={() => handleModeSelection('Scheduling')}>Scheduling</button>
      <button onClick={() => handleModeSelection('PageReplacement')}>Page Replacement</button>
    </div>
  );
}

export default App;

