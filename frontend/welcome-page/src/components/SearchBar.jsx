import React, {useState} from "react";

import { FaSearch } from "react-icons/fa";

import "./SearchBar.css";

export const SearchBar = ({setResults}) => {
        const [input, setInput] = useState("");

        const fetchData = (value) => { 
            fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => response.json())
            .then((json) => {  // normally, the front end stops here and backend is responsible to filtering the information which in this case we are filtering for (user)
                const results = json.filter((user) => {
                    return value && user && user.name && user.name.toLowerCase().includes(value);
                });
                setResults(results);
            });
        } // backend

        const handleChange = (value) => {
            setInput(value);
            fetchData(value);
        }

    return (
        <div className="input-wrapper">  
         <FaSearch id="search-icon"/>
          <input 
            className="text-lg" // Adjust size as needed
            placeholder="Search" 
            value={input} 
            onChange={(e) => handleChange(e.target.value)}
        />
        </div>
    );

};