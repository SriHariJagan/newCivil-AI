import { jwtDecode } from "jwt-decode";

const isTokenValid = (navigate = null) => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    const isExpired = exp <= Math.floor(Date.now() / 1000);

    if (isExpired) {
      localStorage.removeItem("authToken");

      // If a navigate function is provided, redirect to login
      if (navigate) {
        navigate("/login");
      }

      return false;
    }

    return true;
  } catch (error) {
    console.error("Token decoding failed:", error);
    localStorage.removeItem("authToken");

    if (navigate) {
      navigate("/login");
    }

    return false;
  }
};

export default isTokenValid;
