import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const navigate = useNavigate();  

  const handleAuth = () => {
    console.log(`Attempting to ${action}...`);
    navigate("/user-profile");  // ✅ Navigate to user profile after login/signup
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Login" ? null : (
          <><div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="Name" />
          </div><div className="input">
              <img src={user_icon} alt="" />
              <input type="text" placeholder="Business Name" />
            </div></>
        )}
        <div className="input">
          <img src={email_icon} alt=""/>
          <input type="email" placeholder="Email" />
        </div>
        <div className="input">
          <img src={password_icon} alt=""/>
          <input type="password" placeholder="Password" />
        </div>
      </div>

      {action === "Sign Up" ? null : (
        <div className="forgot-password">Reset Password? <span>Click Here!</span></div>
      )}
      
      <div className="submit-container">
        <div 
          className={action === "Login" ? "submit gray" : "submit"} 
          onClick={() => setAction("Sign Up")} 
        >
          Sign Up
        </div>
        <div 
          className={action === "Sign Up" ? "submit gray" : "submit"} 
          onClick={() => setAction("Login")} 
        >
          Login
        </div>
      </div>

      {/* ✅ Updated to navigate to user profile */}
      <div className="submit-container">
        <div className="submit" onClick={handleAuth}>
          Enter
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
