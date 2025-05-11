import React from 'react';
import './Navbar.css';
import logo from '../images/logo.png';
import CartoonButton from './buttons/CartoonButton';
import GoogleSignIn from './auth/GoogleSignIn';
import styled from 'styled-components';

const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #FFFFFF;
  border: 3px solid #0f1418;
  border-radius: 0;
  box-shadow: 0 4px 0 0 #0f1418;
  padding: 1rem 2rem;
  margin: 0;
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <nav className="navbar">
        <div className="navbar-logo">
          <CartoonButton color="#ffffff" onClick={() => window.open('https://cantongoodfellows.org/', '_blank')}>
            <img src={logo} alt="logo" className="logo-image"/>
          </CartoonButton>
        </div>
        <ul className="navbar-links">
          <li>
            <CartoonButton color="#">
              <p className="navbar-link">Home</p>
            </CartoonButton>
          </li>
          <li>
            <CartoonButton color="#" onClick={() => window.open('https://cantongoodfellows.org/welcome/about/ ', '_blank')}>
              <p className="navbar-link">About</p>
            </CartoonButton>
          </li>
          <li>
            <CartoonButton color="#">
              <p className="navbar-link">Contact</p>
            </CartoonButton>
          </li>
          <li>
            <GoogleSignIn/>
          </li>
        </ul>
      </nav>
    </NavbarContainer>
  );
};

export default Navbar;