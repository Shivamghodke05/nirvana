import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const user = localStorage.getItem('user');

  if (user) {
    const userData = JSON.parse(user);
    if (userData.userType === 'institute') {
      return <Navigate to="/institute-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
