import React from 'react';
import './Navbar.css';
import logo from '../images/logo.png';
import CartoonButton from './buttons/CartoonButton';
import GoogleSignIn from './auth/GoogleSignIn';
import Container from './containers/CartoonContainer';

import { useAuth } from '../firebase/contexts/AuthContext';
import { logOut } from '../firebase/auth';

import { Link, useNavigate } from 'react-router-dom';


const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
            <Link to="/">
              <CartoonButton color="#">
                <p className="navbar-link">Home</p>
              </CartoonButton>
            </Link>
          </li>
          <li>
              <CartoonButton color="#" onClick={() => window.open('https://cantongoodfellows.org/welcome/about/ ', '_blank')}>
              <p className="navbar-link">About</p>
            </CartoonButton>
          </li>
          <li>
            <CartoonButton color="#" onClick={() => {
              if (user) {
                navigate('/catalog');
              } else {
                navigate('/login');
              }
            }}>
              <p className="navbar-link">Contact</p>
            </CartoonButton>
          </li>
          <li>
          <CartoonButton color="#1EC9F2" onClick={() => {
            if (user) {
              logOut();
              navigate(0);
            } else {
              navigate('/login');
            }
          }}>
              <p className="navbar-link">{user ? "Log Out" : "Log In"}</p>
            </CartoonButton>
          </li>
        </ul>
      </nav>
    </Container>
  );
};

export default Navbar;