import "./App.css";
import React, { useState } from "react";

import { SearchBar } from "./Components/SearchBar";
import { SearchResultList } from "./Components/SearchResultList";

import Home from "./Components/Home";
import About from "./Components/About";
import Work from "./Components/Work";
import Testimonial from "./Components/Testimonial";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";

function App() {
  const [results, setResults] = useState([]); // State for search results
  const [searchActive, setSearchActive] = useState(false); // Track if search is active

  return (
    <div className="App">
      {/* Search Bar Component */}
      <div className="search-bar-container">
        <SearchBar setResults={setResults} setSearchActive={setSearchActive} />
        {searchActive && results.length > 0 && <SearchResultList results={results} />}
        {searchActive && results.length === 0 && <p className="no-results">No users found.</p>}
      </div>

      {/* Show main content only if search is NOT active */}
      {!searchActive && (
        <>
          <Home />
          <About />
          <Work />
          <Testimonial />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;