import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // This is now your Welcome page
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Welcome from "./pages/Welcome";
import Sam from "./game/sam/Sam";
import CreateRoom from "./socket/CreateRoom";
import WaitingRoom from "./socket/WaitingRoom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/welcome" element={<Welcome/>}/>
        <Route path="/game/sam" element={<Sam />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/room/:roomId" element={<WaitingRoom gameType="sam" />} />
      </Routes>
    </div>
  );
};

export default App;
