import { useState } from 'react';
import './App.css'
import { SearchResultsList } from './components/SearchResultsList';
import { SearchBar } from './components/SearchBar';

import logo from './components/imgs/Logo3.png';
function App() {
  const [results, setResults] = useState([]);

  return (
    <div className='App'> 

      <div className= "top-dec-container"> 
      <link rel="shortcut icon" type="image/x-icon" href="./components/imgs/Logo.png" />
      <div className= "mid-dec-container"> </div>
      </div>




      <div className= "logo-top-container">
      <img src={logo} alt="Logo that says Mini Market" />
      </div>

      <div className='top-buttons'>
      <button type="button">Home</button>
         </div>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap" rel="stylesheet"></link>



     <div className="search-bar-container"> 
      <SearchBar setResults={setResults}/>
      <SearchResultsList results = {results}/>
     </div> 
    </div>
  ) 
}

export default App;
