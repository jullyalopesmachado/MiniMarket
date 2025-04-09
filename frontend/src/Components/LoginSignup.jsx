import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import { sendData } from "./api";
import { fetchData } from "./api";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusiness] = useState("");
  const navigate = useNavigate();  

  


const handleAuth = async () => {
  const userData = {
    name: userName,
    email,
    password,
    businessName,
    action,
  };

  try {
    const response = await sendData(userData, action);
    console.log("Response from server:", response);


  
    if (response.ok) {
      console.log("continue");
      const data = await response.json();

      if (action === "Sign Up") {
        setAction("Login");
        alert("Sign-up successful! Please log in.");
      } else if (action === "Login") {
      
         localStorage.setItem("token", data.token);
         console.log("token:", data.token);
         alert("Login successful!");
         console.log("Navigating to user profile...");
         navigate("/user-profile"); 
      }
     } else {
        alert(response.message || `${action} failed. Please try again.`);
      }
      
    } catch (error) {
    console.error("Error during authentication:", error);
    alert("An error occurred. Please try again.");
  }
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
            <input 
              type="text" 
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} 
              />
            
          </div><div className="input">
              <img src={user_icon} alt="" />
              <input 
              type="text" 
              placeholder="Business Name"
              value={businessName}
              onChange={(e) => setBusiness(e.target.value)} 
               />
            </div></>
        )}
        <div className="input">
          <img src={email_icon} alt=""/>
          <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="input">
          <img src={password_icon} alt=""/>
          <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          />
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
