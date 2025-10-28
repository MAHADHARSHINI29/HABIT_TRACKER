import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <p>Loading...</p>; // spinner optional

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
