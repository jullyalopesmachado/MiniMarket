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
  const [results, setResults] = useState([]);           // State for search results
  const [searchActive, setSearchActive] = useState(false); // Whether dropdown is active
  const [query, setQuery] = useState("");                 // Controlled input for search bar

  // When a result is clicked, update the search input and hide the dropdown.
  const handleSelect = (businessName) => {
    setQuery(businessName);
    setSearchActive(false);
    setResults([]);
  };

  return (
    <div className="App">
      {/* Search Bar & Dropdown Container */}
      <div
        className="search-bar-container"
        style={{ position: "relative", zIndex: 1000 }}
      >
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

      {/* Main Content Always Visible */}
      <Home />
      <About />
      <Work />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
