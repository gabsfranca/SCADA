import logo from './logo.svg';
import React, {useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/oiee')
      .then(response => response.text())
      .then(data => setMessage(data));
  }, [])

  return (
    <div className="App">
      <header className="Cabeçaho">
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
