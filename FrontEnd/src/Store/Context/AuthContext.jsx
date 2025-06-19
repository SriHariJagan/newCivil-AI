import { useState } from "react";
import { ENDPONITS } from "../../../url";
import { AuthContext } from "../UseContexts/UseContexts";


const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");

  

  const authenticate = async (email, password) => {
    console.log("email",email);
    console.log("pas",password);
    try {
      const response = await fetch(ENDPONITS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("ressponseadta",data)
      const accessToken = data?.results?.tokens?.access_token;

      setToken(accessToken);
      localStorage.setItem("authToken", accessToken);

      if(accessToken){
        window.location.href = "/";
      }

    } catch (error) {
      console.log("Login Error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticate, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
