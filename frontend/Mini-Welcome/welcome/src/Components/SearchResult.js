import React from 'react';
import "./SearchResult.css";

export const SearchResult = ({ result }) => {
    return (
        <div 
            className='search-result' 
            onClick={() => alert(`You have clicked on ${result.name}`)}
        >
            {result.name}
        </div>
    );
};
