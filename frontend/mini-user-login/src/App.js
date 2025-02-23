import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import LoginSignup from './components/LoginSignup';
import UserProfile from "./components/UserProfile"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/user-profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
