import { useState } from "react";
import "./MovieApp.css";

export const MovieApp = () => {
  const [search, setSearch] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); 

  const urlBase = "https://api.themoviedb.org/3/search/movie";
  const API_KEY = "f78ad6201273233e1d67e405e58ec4af";

  const handleInputChange = ({ target }) => {
    setSearch(target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (search.trim() === "") return;
    fetchMovies();
    setHasSearched(true); 
  };

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${urlBase}?query=${search}&api_key=${API_KEY}&language=es-ES`
      );
      const data = await response.json();
      if (data.results) {
        setMovieList(data.results);
      } else {
        setMovieList([]);
      }
    } catch (error) {
      setError("No se pudo obtener la lista de películas. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Buscador de Películas</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribí una película"
          value={search}
          onChange={handleInputChange}
        />
        <button>Buscar</button>
      </form>

      {isLoading && <p>Cargando películas...</p>}
      {error && <p className="error">{error}</p>}
      {movieList.length > 0 ? (
        <div className="movie-list">
          {movieList.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                    : "https://via.placeholder.com/200x300?text=Sin+Imagen"
                }
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <p>{movie.overview || "No hay descripción disponible."}</p>
            </div>
          ))}
        </div>
      ) : (
        hasSearched &&
        !isLoading &&
        !error && <p>No se encontraron películas. Intenta con otra búsqueda.</p>
      )}
    </div>
  );
};