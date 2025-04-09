import { Routes, Route } from 'react-router-dom';
import Home from "./Components/pages/Home"; // This is now your Welcome page
import Login from "./Components/pages/Login";
import SignUp from "./Components/pages/SignUp";


const App = () => {

  return (
    <div>
      {/* {showNavbar && <Navbar />} */}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </div>
  );
};

export default App;