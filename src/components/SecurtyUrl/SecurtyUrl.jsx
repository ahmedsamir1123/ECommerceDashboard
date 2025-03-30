import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; 

function SecurtyUrl({ element }) {
  const user = useSelector((state) => state.auth.user); 


  if (!user) {
    return <Navigate to="/login" />; 
  }

  return element; 
}

export default SecurtyUrl;
