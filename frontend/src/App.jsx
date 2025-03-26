import "./App.css"; 
import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

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

function App() {
  const [results, setResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");

  const location = useLocation();

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
      </Routes>
    </div>
  );
}

export default App;