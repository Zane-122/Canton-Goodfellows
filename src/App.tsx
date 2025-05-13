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
import { Family } from './firebase/families';
import { Child } from './firebase/families';
import Button from './components/buttons/CartoonButton';

import { EmailSignIn } from './components/auth/EmailSignIn';
import { EmailSignUp } from './components/auth/EmailSignUp';
import { LogIn } from './pages/LogIn';
import { SignOut } from './components/auth/SignOut';
import {SignUp} from './pages/SignUp';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: radial-gradient(circle at 50% 200%, #87CEEB 50%, #4169E1 70%, #1E3A8A 100%);
    background-attachment: fixed;
  }
`;

const AddFamilyButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
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