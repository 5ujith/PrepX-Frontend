import { Outlet } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import { createContext, useState } from "react";
import LoginComponent from "./components/LoginComponent";

export const UserContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  if(!isAuthenticated) {
    return <LoginComponent setIsAuthenticated = {setIsAuthenticated} setUser = {setUser}/>

  }

  return (
    <>
    <UserContext.Provider value = {[user, setUser]}>
      <HeaderComponent />
      <Outlet />
    </UserContext.Provider>
    </>
  );
}

export default App;
