import React from "react";
import "./SearchResultList.css";

export const SearchResultList = ({ results, onSelect }) => {
  return (
    <div className="results-list">
      {results.map((user) => (
        <div
          key={user._id}
          className="result-item"
          onClick={() => onSelect(user.businessName)}
        >
          {user.businessName}
        </div>
      ))}
    </div>
  );
};
