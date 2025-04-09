import "./App.css"; 
import React, { useState, useEffect } from "react";
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
import CompanyList from './Components/CompanyList';
import Opportunities from './Components/Opportunities';




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

  // useState hook to manage the logged-in user state, initially set to null
  const [user, setUser] = useState(null); 
  useEffect(() => {
  //retrieve authentication token from local storage
    const token = localStorage.getItem("token");
      if (token){
        fetchUserProfile(); // if a token exists, fetch the user profile
      }
  }, []); // Empty dependency array to run only once on mount

  const fetchUserProfile = async () => {
    try {
      // Make a request to the profile API endpoint with the authorization header
      const response = await fetch("http://localhost:3000/api/profile", {
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
      });
      
      // if reponse is not OK, throw an error

      if (!response.ok) {
        localStorage.removeItem("token");
        throw new Error("Failed to fetch user profile");
      }
      // Parse the JSON response conataining user profile data

      const userData = await response.json();
      console.log("User data fetched:", userData); // Log fetched user data
      // Update the user state with the fetched data

      setUser(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const hiddenRoutes = ["/login-signup", "/user-profile", "/companies-page", "/opportunities"];
  const showSearchBar = !hiddenRoutes.includes(location.pathname);  


  return (
    <div className="App">
      {showSearchBar && (
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
        <Route path="/companies-page" element={<CompanyList user={user} />} />

        <Route path="/opportunities/view" element={<Opportunities />} />

        {/* <Route path="/companies-page" element={<CompanyList  />} /> */}  {/* This route is without admin priviledges */}
        {/* <Route path="/companies-page" element={<CompanyList isAdmin={isAdmin} />} />  {/* The 'isAdmin' prop is */}
        {/*passed to the component to determine if the user has admin privileges
        This allows the component to conditionally render admin-specific features 
        (e.g., an "Edit" button) */}
      </Routes>
    </div>
  );
}

export default App;