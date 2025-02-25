import React from "react";
import "./SearchResultList.css";

export const SearchResultList = ({ results }) => {
    console.log("Results received in SearchResultList:", results); // Debugging

    return (
        <div className="results-list">
            {results && results.length > 0 ? (
                results.map((user) => (
                    <div key={user._id} className="result-item">
                        <strong>{user.name}</strong> - {user.email} - {user.businessName}
                    </div>
                ))
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};
