import React from 'react';

import { HomePage } from './pages/HomePage';
import './App.css';
import { AuthProvider } from './firebase/contexts/AuthContext';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: radial-gradient(circle at 50% 200%, #87CEEB 50%, #4169E1 70%, #1E3A8A 100%);
    background-attachment: fixed;
  }
`;

const App: React.FC = () => {
    return (
        <AuthProvider>
            <GlobalStyle />
            <HomePage />
        </AuthProvider>
    );
};

export default App;
