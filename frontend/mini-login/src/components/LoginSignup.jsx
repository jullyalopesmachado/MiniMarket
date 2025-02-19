import React, { useState } from "react";  // <-- Correct import for useState


import './LoginSignup.css'

import user_icon from './assets/person.png'
import email_icon from './assets/email.png'
import password_icon from './assets/password.png'


const LoginSingup = () => {

   const [action, setAction] = useState("Sign Up");

    return (
        <div className = 'container'>
         <div className = "header">
          <div className = "text">{action}</div>
           <div className = "underline"></div>
         </div>
         <div className = "inputs"> 
            {action==="Login"? <div> </div> : <div className = "input"> {/* if action is login, the name field becomes an empty div. Else, if action is sign up, then name fiel pops up again.   */}
            <img src= {user_icon} alt= ""/>
            <input type = "text" placeholder="Name" />
            </div>}
        
         <div className = "input">
            <img src= {email_icon} alt= ""/>
            <input type = "email" placeholder="Email" />
            </div>
         <div className = "input">
            <img src= {password_icon} alt= ""/>
            <input type = "password" placeholder="Password" />
            </div>
          </div>
          {action=="Sign Up"? <div></div>: <div className="forgot-password">Reset Password? <span>Click Here!</span></div>}
          
          <div className="submit-container">
            <div className={action=== "Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up </div>
            <div className={action=== "Sign Up"?"submit gray":"submit"} onClick = { () => {setAction("Login")}}>Login</div>

          </div>
        </div>

    )
}
export default LoginSingup;

