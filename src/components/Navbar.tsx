import React from 'react';
import './Navbar.css';
import logo from '../images/logo.png';
import CartoonButton from './buttons/CartoonButton';
import Container from './containers/CartoonContainer';
const Navbar: React.FC = () => {
  return (
    <Container color="#D84040" className="navbar-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <CartoonButton color="#ffffff">
            <img src={logo} alt="logo" className="logo-image"/>
          </CartoonButton>
        </div>
        <ul className="navbar-links">
          <li>
            <CartoonButton color="#A31D1D">
              <p className="navbar-link">Home</p>
            </CartoonButton>
          </li>
          <li>
            <CartoonButton color="#A31D1D">
              <p className="navbar-link">About</p>
            </CartoonButton>
          </li>
          <li>
            <CartoonButton color="#A31D1D">
              <p className="navbar-link">Contact</p>
            </CartoonButton>
          </li>
          <li>
            <CartoonButton color="#A31D1D">
              <p className="navbar-link">Sign In</p>
            </CartoonButton>
          </li>
        </ul>
      </nav>
    </Container>
  );
};

export default Navbar;