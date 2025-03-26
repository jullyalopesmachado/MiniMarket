import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ query, setQuery, setResults, setSearchActive }) => {
  const fetchData = async (value) => {
    if (!value.trim()) return; // Prevent empty search requests

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/users?search=${encodeURIComponent(value)}`;
    console.log("Fetching from:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      console.log("API Response:", json);

      // Filter by both name and businessName
      const filteredResults = Array.isArray(json)
        ? json.filter(
            (user) =>
              user?.name?.toLowerCase().includes(value.toLowerCase()) ||
              user?.businessName?.toLowerCase().includes(value.toLowerCase())
          )
        : [];
      console.log("Filtered Results:", filteredResults);
      setResults(filteredResults);
    } catch (error) {
      console.error("Error fetching users:", error);
      setResults([]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      setSearchActive(true);
      fetchData(value);
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
