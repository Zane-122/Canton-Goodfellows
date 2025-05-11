import React from 'react';
import './Navbar.css';
import logo from '../images/logo.png';
import CartoonButton from './buttons/CartoonButton';
import GoogleSignIn from './auth/GoogleSignIn';
import Container from './containers/CartoonContainer';

const Navbar: React.FC = () => {
  return (
    <Container className="navbar-container" solidBorder={true}>
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
    </Container>
  );
};

export default Navbar;