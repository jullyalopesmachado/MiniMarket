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

  return (
    <div className="App">
      {/* Search Bar Component */}
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        {results.length > 0 && <SearchResultList results={results} />}
      </div>

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