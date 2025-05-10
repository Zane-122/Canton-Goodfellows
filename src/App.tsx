import React from 'react';
import './App.css';
import CartoonButton from './components/buttons/CartoonButton';
import CartoonContainer from './components/containers/CartoonContainer';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <CartoonContainer color="#FFFFFF">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* All of this can be removed i am just testing */}
            <CartoonButton color="#FF6B6B">
              Register for Donations
            </CartoonButton>

            <CartoonButton color="#4ECDC4">
              Register to Sponsor
            </CartoonButton>

            <CartoonButton color="#FFE66D">
              Donate Now!
            </CartoonButton>
          </div>
        </CartoonContainer>
      </header>
    </div>
  );
};

export default App; 