import React, { useState } from 'react';
import './App.css';
import CartoonButton from './components/buttons/CartoonButton';
import CartoonContainer from './components/containers/CartoonContainer';
import CartoonToggleButton from './components/buttons/CartoonToggleButton';

const App: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <CartoonContainer color="#FFFFFF">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CartoonToggleButton 
              color="#FFFFFF"
              isActive={isActive}
              onToggle={setIsActive}
            >
              {isActive ? 'Active' : 'Inactive'}
            </CartoonToggleButton>
            <CartoonButton color="#FFFFFF">
              Regular Button
            </CartoonButton>
          </div>
        </CartoonContainer>
      </header>
    </div>
  );
};

export default App; 