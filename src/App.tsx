import React from 'react';
import './App.css';
import CartoonButton from './components/buttons/CartoonButton';
import CartoonContainer from './components/containers/CartoonContainer';
import CartoonHeader from './components/headers/CartoonHeader';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <CartoonContainer color="#FFFFFF">
          <CartoonHeader 
            title="Canton Goodfellows Info"
          />
        </CartoonContainer>
        
          <CartoonContainer color="#FFFFFF">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        </div>
      </header>
    </div>
  );
};

export default App; 