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
import Test from './rainforest/Catalog';

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
  const handleAddFamily = async () => {
    const Children = Array.from({ length: 2 }, (_, i) => ({
      ChildID: `Child ${String.fromCharCode(65 + i)}`,
      ChildGender: "Unknown",
      ChildAge: 0,
      ChildToys: [],
      HasDisabilities: false,
      SchoolName: "Unknown"
    }));

    try {
      await addFamily({
        Parent1Name: "Parent 1",
        Parent2Name: "Parent 2",
        StreetAddress: "123 Main St",
        ZipCode: "48188",
        PhoneNumber: "555-0123",
        Children,
        isSponsored: false,
        timestamp: new Date()
      });
      console.log("Family added successfully!");
    } catch (error) {
      console.error("Failed to add family:", error);
    }
  };

  return (
    <AuthProvider>
      <HomePage />
      {/* <SponsorFormPage /> */}
    </AuthProvider>
  );
};

export default App; 