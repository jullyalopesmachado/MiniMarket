import React from "react";
import "./SearchResultList.css";

export const SearchResultList = ({ results, onSelect }) => {
  console.log("Results received in SearchResultList:", results);

  return (
    <div className="results-list">
      {results && results.length > 0 ? (
        results.map((user) => (
          <div
            key={user._id}
            className="result-item"
            onClick={() => onSelect(user.businessName)}
          >
            {user.businessName}
          </div>
        ))
      ) : (
        <p className="no-results">No results found</p>
      )}
    </div>
  );
};
