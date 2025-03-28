import "./App.css"; 
import React, { useState } from "react";
import Axios from "axios";
import { Routes, Route, useLocation } from "react-router-dom";

import { SearchBar } from "./Components/SearchBar";
import { SearchResultList } from "./Components/SearchResultList";

import Home from "./Components/Home";
import About from "./Components/About";
import Work from "./Components/Work";
import Testimonial from "./Components/Testimonial";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import LoginSignup from "./Components/LoginSignup";
import UserProfile from "./Components/UserProfile"; // Import UserProfile



export const fetchData = async ({ value, action }) => {

  let actionUrl = "";
  if (action === "search") {
    if (!value.trim()) return; // Prevent empty search requests

    actionUrl = `users?search=${encodeURIComponent(value)}`;

  } else if (action === "profile") {
    actionUrl = `profile`; // Fetch user profile

  }
  
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/${actionUrl}`;
    console.log("Fetching from:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      console.log("API Response:", json);
      return json;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
      
    };

  export const sendData = async ( data, action ) => {
    let actionUrl = "";
    if (action === "Sign Up") {
      actionUrl = "users/register";
      data = { name: data.name, email: data.email, businessName: data.businessName, password: data.password };
    }
    else if (action === "Login") {
      actionUrl = "login";
      data = { email: data.email, password: data.password };
    }

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/${actionUrl}`;
  
  try {  
    console.log(data)
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Server error details:", errorDetails);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response;

  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};

  export const updateData = async (updatedProfile) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/users/${updatedProfile._id}`;

  try {  
    console.log("updated user data:", updatedProfile)
    const token = localStorage.getItem("token");
  const response = await Axios.put(apiUrl, updatedProfile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
  return response.data;
  } else {
    throw new Error("Error updating user data");
  }
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
  };

function App() {
  const [results, setResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");

  const location = useLocation();

  const isAdmin = true; {/* Replace this with actual authentication logic. This allows for editing mode (admin) in company page list. */} 

  const handleSelect = (businessName) => {
    setQuery(businessName);
    setSearchActive(false);
    setResults([]);
  };

  return (
    <div className="App">
      {location.pathname !== "/login-signup" && location.pathname !== "/user-profile" && (
        <div className="search-bar-container" style={{ position: "relative", zIndex: 1000 }}>
          <SearchBar
            query={query}
            setQuery={setQuery}
            setResults={setResults}
            setSearchActive={setSearchActive}
          />
          {searchActive && results.length > 0 && (
            <SearchResultList results={results} onSelect={handleSelect} />
          )}
          {searchActive && results.length === 0 && (
            <p className="no-results">No users found.</p>
          )}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={ 
            <>
              <Home />
              <About />
              <Work />
              <Testimonial />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route path="/user-profile" element={<UserProfile />} /> {/* Add route */}
        <Route path="/home-page" element={<Home />} />
        {/* <Route path="/companies-page" element={<CompanyList  />} /> */}  {/* This route is without admin priviledges */}
        <Route path="/companies-page" element={<CompanyList isAdmin={isAdmin} />} />  {/* The 'isAdmin' prop is 
        passed to the component to determine if the user has admin privileges
        This allows the component to conditionally render admin-specific features 
        (e.g., an "Edit" button) */}
      </Routes>
    </div>
  );
}

export default App;