import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserDashboards = () => {
  const userRole = Cookies.get('userRole')?.toLowerCase() || '';
  const isLogged = Cookies.get('isLogged') === 'true';
  const isDetailsFilled = Cookies.get('is_details_filled') === 'true';

  if (userRole === 'teacher') {
    return isLogged ? <Navigate to="/teacher-dashboard" /> : <Navigate to="/login" />;
  }

  if (userRole === 'parent') {
    return isLogged ? <Navigate to="/parent-dashboard" /> : <Navigate to="/login" />;
  }

  if (userRole === 'student') {
    if (!isDetailsFilled) {
      return <Navigate to="/student-details" />;
    } else if (!isLogged) {
      return <Navigate to="/login" />;
    } else {
      return <Navigate to="/student-dashboard" />;
    }
  }

  return <Navigate to="/auth-roles" />;
};

export default UserDashboards;
