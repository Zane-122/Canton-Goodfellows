import React from 'react';
import { HomePage } from './HomePage';
import './App.css';
import Container from './components/containers/CartoonContainer';
import Header from './components/headers/CartoonHeader';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <HomePage />
      </header>
    </div>
  );
};

export default App; 