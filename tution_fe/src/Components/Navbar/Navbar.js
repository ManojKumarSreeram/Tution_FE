import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Navbar.css';
import { FaUserCircle, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('id');
    Cookies.remove('is_details_filled');
    Cookies.remove('isLogged');
    Cookies.remove('token');
    Cookies.remove('userRole');
    navigate('/');
  };

  const handleLogoClick = () => {
    const userRole = Cookies.get('userRole');
    switch (userRole) {
      case 'teacher':
        navigate('/teacher-dashboard');
        break;
      case 'student':
        navigate('/student-dashboard');
        break;
      case 'parent':
        navigate('/parent-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick}>
        <img src="/Tution_logo.png" alt="Logo" />
      </div>

      <div className="navbar-desktop">
        <FaUserCircle className="profile-icon" />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="navbar-mobile">
        <FaBars className="hamburger" onClick={toggleMenu} />
        {menuOpen && (
          <div className="mobile-menu">
            <div className="menu-item">
              <FaUserCircle className="profile-icon" /> Profile
            </div>
            <div className="menu-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
