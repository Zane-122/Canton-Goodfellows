
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          {/* <HomePage /> */}
          <SponsorFormPage />
        </header>
      </div>
    </AuthProvider>
  );
};

export default App; 