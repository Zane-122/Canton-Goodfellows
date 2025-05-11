import React from 'react';
import { HomePage } from './pages/HomePage';
import { SponsorFormPage } from './pages/SponsorFormPage';
import './App.css';
import Container from './components/containers/CartoonContainer';
import Header from './components/headers/CartoonHeader';
import { AuthProvider } from './firebase/contexts/AuthContext';
import GoogleSignIn from './components/auth/GoogleSignIn';
import Input from './components/inputs/CartoonInput';
import { addSponsor } from './firebase/sponsors';
import styled, { createGlobalStyle } from 'styled-components';
import {addFamily, getFamilies, updateFamilySponsoredStatus} from './firebase/families';
import { Family } from './firebase/families';
import { Child } from './firebase/families';
import Button from './components/buttons/CartoonButton';

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
      <HomePage />
      {/* <SponsorFormPage /> */}
    </AuthProvider>
  );
};

export default App; 