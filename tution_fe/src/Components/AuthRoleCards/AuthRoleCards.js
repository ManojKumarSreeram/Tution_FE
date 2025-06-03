import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AuthRoleCards.css';

const AuthRoleCards = () => {
  const navigate = useNavigate();

  const handleSignUp = (role) => {
    navigate(`/signup/${role.toLowerCase()}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const roles = [
    { role: 'Teacher', icon: <FaChalkboardTeacher /> },
    { role: 'Student', icon: <FaUserGraduate /> },
    { role: 'Parent', icon: <FaUserFriends /> },
  ];

  return (
    <div className="user-role-container">
      {roles.map(({ role, icon }) => (
        <div className="card" key={role}>
          <div className="card-icon">{icon}</div>
          <h2>{role}</h2>
          <div className="card-buttons">
            <button className="btn signup" onClick={() => handleSignUp(role)}>
              Sign Up
            </button>
            <button className="btn login" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthRoleCards;
