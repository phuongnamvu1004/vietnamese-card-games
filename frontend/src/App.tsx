
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./Components/pages/Login.tsx";
import Signup from "./Components/pages/Signup.tsx";
import Navbar from "./Components/pages/Navbar";

import { useAuthStore } from "./store/useAuthStore";


const App = () => {
  const { user, isAuthenticated } = useAuthStore();
  return (
    <div>
      <Navbar/>
        <Routes/>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
    </div>
  )
}

export default App