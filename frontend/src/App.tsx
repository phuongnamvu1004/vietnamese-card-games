import { Routes, Route } from 'react-router-dom';
import Home from "./Components/pages/Home"; // This is now your Welcome page
import Login from "./Components/pages/Login";
// import Signup from "./Components/pages/Signup";
// import Navbar from "./Components/pages/Navbar";

// import { useAuthStore } from "./store/UseAuthStore";
// import { useEffect } from 'react';

const App = () => {
  // const { authUser, checkAuth } = useAuthStore();

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  // console.log({authUser});
  
  // // If the user is logged in, show the navbar
  // const showNavbar = authUser !== null;

  return (
    <div>
      {/* {showNavbar && <Navbar />} */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </div>
  );
};

export default App;