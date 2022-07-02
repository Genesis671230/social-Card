import { useContext } from 'react';
import { AuthorizationContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ children }) => {
  const { currentUser } = useContext(AuthorizationContext);

  return currentUser ? children : <Navigate to="/" />;
};
