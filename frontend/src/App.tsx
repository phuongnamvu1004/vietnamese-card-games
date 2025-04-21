import { Routes, Route } from 'react-router-dom';
import Home from "./Components/pages/Home"; // This is now your Welcome page
import Login from "./Components/pages/Login";
import SignUp from "./Components/pages/SignUp";
import Game from "./Components/pages/Game";


const App = () => {

  return (
    <div>
      {/* {showNavbar && <Navbar />} */}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/game" element={<Game/>}/>
      </Routes>
    </div>
  );
};

export default App;