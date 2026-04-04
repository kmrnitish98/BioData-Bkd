import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../ui/Loader';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <Loader message="Authenticating..." />;
  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
