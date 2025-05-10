import React from 'react';
import './App.css';
import { HomePage } from './HomePage';
import Container from './components/containers/CartoonContainer';
import Header from './components/headers/CartoonHeader';
import { AuthProvider } from './firebase/contexts/AuthContext';
import GoogleSignIn from './components/auth/GoogleSignIn';
import Input from './components/inputs/CartoonInput';
import { addSponsor } from './firebase/sponsors';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
};

export default App; 