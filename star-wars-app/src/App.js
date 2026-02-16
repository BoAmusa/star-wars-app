import "./App.css";
import StarWarsSearch from "./components/StarWarsSearch";
import * as React from "react";

export const App = () => {
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [akababCharacters, setAkababCharacters] = React.useState([]);

  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg";

  // Fetch Akabab Star Wars character data once
  // Minor change to trigger github pages
  React.useEffect(() => {
    fetch("https://akabab.github.io/starwars-api/api/all.json")
      .then((res) => res.json())
      .then((data) => setAkababCharacters(data))
      .catch(() => setAkababCharacters([]));
  }, []);

  // This function will be called when the search is triggered
  const handleSearch = async (searchTerm) => {
    setLoading(true);
    console.log("Searching for:", searchTerm);

    try {
      // SWAPI does not require an API key or OAuth
      const url = `https://swapi.dev/api/people/?search=${encodeURIComponent(
        searchTerm
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response:", response);
      if (!response.ok) {
        throw new Error(
          `SWAPI error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Set the actual results from the API
      setSearchResults(data.results || []);

      if ((data.results || []).length === 0) {
        console.warn("No results found for:", searchTerm);
      }
    } catch (error) {
      console.error("Search failed:", error);
      throw error; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="starwars-background"
      style={{ backgroundImage: "none", backgroundColor: "#fff" }} // White background, no image
    >
      <StarWarsSearch onSearch={handleSearch} />

      {/* Display search results */}
      {loading && (
        <div className="loading-container">
          <p>Loading Star Wars characters....</p>
        </div>
      )}

      {/* Display search results with enhanced styling */}
      {searchResults.length > 0 && !loading && (
        <div className="results-container">
          <h2 className="results-title">
            Found {searchResults.length} Star Wars Characters
          </h2>
          <div className="characters-grid">
            {searchResults.map((character, idx) => {
              // Find Akabab image by name (case-insensitive)
              const akababChar = akababCharacters.find(
                (c) => c.name.toLowerCase() === character.name.toLowerCase()
              );
              const imageUrl =
                akababChar && akababChar.image
                  ? akababChar.image
                  : fallbackImage;
              return (
                <div key={idx} className="character-card">
                  <div className="character-info">
                    <img
                      src={imageUrl}
                      alt={character.name}
                      className="character-image"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                        marginBottom: "10px",
                        background: "#eee",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                    <h3 className="character-name">{character.name}</h3>
                    <p className="character-description">
                      Birth Year: {character.birth_year}
                      <br />
                      Gender: {character.gender}
                      <br />
                      Height: {character.height} cm
                      <br />
                      Mass: {character.mass} kg
                      <br />
                      Hair Color: {character.hair_color}
                      <br />
                      Skin Color: {character.skin_color}
                      <br />
                      Eye Color: {character.eye_color}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
