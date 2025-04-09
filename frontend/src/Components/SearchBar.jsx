import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { fetchData } from "./api";

export const SearchBar = ({ query, setQuery, setResults, setSearchActive }) => {
  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      setSearchActive(true);
      try {
        const json = await fetchData({ value, action: "search" });
        const Results = Array.isArray(json) ? json : [];
        setResults(Results);
      } catch (error) {
        console.error("Error fetching users:", error);
        setResults([]);
      }
    } else {
      setSearchActive(false);
      setResults([]);
    }
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        className="text-lg"
        placeholder="Search participating companies"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};
