import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ setResults, setSearchActive }) => {
    const [input, setInput] = useState("");

    const fetchData = async (value) => {
        if (!value.trim()) return; // Prevent empty search requests

        const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
        const apiUrl = `${baseUrl}/api/users?search=${encodeURIComponent(value)}`;
        console.log("Fetching from:", apiUrl);

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            console.log("API Response:", json);

            // ✅ Filter by both name and businessName
            const results = Array.isArray(json)
                ? json.filter(user =>
                    user?.name?.toLowerCase().includes(value.toLowerCase()) ||
                    user?.businessName?.toLowerCase().includes(value.toLowerCase())
                )
                : [];

            console.log("Filtered Results:", results);
            setResults(results);
        } catch (error) {
            console.error("❌ Error fetching users:", error);
            setResults([]); // Set empty results on error
        }
    };

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                className="text-lg"
                placeholder="Search users by name, email, or business name"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
};
