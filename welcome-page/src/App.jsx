import { useState } from "react";
import "./App.css";
import { SearchResultsList } from "./components/SearchResultsList";
import { WelcomePage } from "./components/WelcomePage"; // Import WelcomePage

function App() {
  const [results, setResults] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="App">
      {showWelcome ? (
        <WelcomePage setShowWelcome={setShowWelcome} setResults={setResults} />
      ) : (
        <div className="search-results-container">
          <SearchResultsList results={results} />
        </div>
      )}
    </div>
  );
}

export default App;
