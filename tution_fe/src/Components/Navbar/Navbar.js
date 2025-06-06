// Navbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Navbar.css';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import {
  getStudentProfileDetails,
  getParentProfileDetails,
  getTeacherProfileDetails,
} from '../../Services/ApiService';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const handleLogout = () => {
    Cookies.remove('id');
    Cookies.remove('is_details_filled');
    Cookies.remove('isLogged');
    Cookies.remove('token');
    Cookies.remove('userRole');
    navigate('/');
  };

  const handleUpdateProfile = () => {
    const userRole = Cookies.get('userRole');

    if (!profileData) return;

    switch (userRole.toLowerCase()) {
      case 'student':
        navigate('/update-student-signup', { state: { data: profileData } });
        break;
      case 'teacher':
        navigate('/update-teacher-signup', { state: { data: profileData } });
        break;
      case 'parent':
        navigate('/update-parent-signup', { state: { data: profileData } });
        break;
      default:
        break;
    }
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

  const handleProfileClick = async () => {
    const userRole = Cookies.get('userRole');
    const id = Cookies.get('id');

    if (showProfileCard) {
      setShowProfileCard(false);
      return;
    }

    try {
      let response;
      if (userRole === 'teacher') {
        response = await getTeacherProfileDetails({ teacher_id: id });
      } else if (userRole === 'student') {
        response = await getStudentProfileDetails({ student_id: id });
      } else if (userRole === 'parent') {
        response = await getParentProfileDetails({ parent_id: id });
      }

      if (response?.data) {
        setProfileData(response.data);
        setShowProfileCard(true);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setShowProfileCard(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick}>
        <img src="/Tution_logo.png" alt="Logo" />
      </div>

      <div className="navbar-desktop">
        <div className="profile-section">
          <FaUserCircle className="profile-icon" onClick={handleProfileClick} />
            {showProfileCard && profileData && (
              <div className="profile-card">
                <h4>{profileData.first_name} {profileData.last_name}</h4>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Phone:</strong> {profileData.phone_number}</p>
                <p><strong>ID:</strong> {profileData.id}</p>
                <button className="update-profile-btn" onClick={handleUpdateProfile}>
                  Update Profile
                </button>
              </div>
            )}

        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="navbar-mobile">
        <FaBars className="hamburger" onClick={toggleMenu} />
        {menuOpen && (
          <div className="mobile-menu">
            <div className="menu-item" onClick={handleProfileClick}>
              <FaUserCircle className="profile-icon" /> Profile
            </div>
                          {showProfileCard && profileData && (
                <div className="profile-card mobile">
                  <h4>{profileData.first_name} {profileData.last_name}</h4>
                  <p><strong>Email:</strong> {profileData.email}</p>
                  <p><strong>Phone:</strong> {profileData.phone_number}</p>
                  <p><strong>ID:</strong> {profileData.id}</p>
                  <button className="update-profile-btn" onClick={handleUpdateProfile}>
                    Update Profile
                  </button>
                </div>
              )}

            <div className="menu-item" onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
