import './App.css';
import { getMovieList, getUpcomingMovie, searchMovie } from "./api"
import { useEffect, useState } from 'react';
import * as Icon from 'react-feather'

const App = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [searchError, setSearchError] = useState(null)
  
  useEffect(() => {
    getMovieList().then((result) => {
      setPopularMovies(result)
    })
  }, [])

  useEffect(() => {
    getUpcomingMovie().then((result) => {
      setUpcomingMovies(result)
    })
  }, [])

  const PopularMovieList = () => {
    if (searchError) {
      return
    }
    return popularMovies.map((movie, i) => {
      return (
        <div className="Movie-wrapper" key={i}>
          <div className="Movie-image-container">
            <img className="Movie-image" src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`} alt={movie.title}/>
            <div className="Overlay">
              <div className="Overlay-content">{movie.overview}</div>
            </div>
          </div>
          <div className="Movie-title">{movie.title}</div>
          <div classname="Movie-info">
            <div className="Movie-date">{new Date(movie.release_date).getFullYear()}</div>
            <div className="Movie-rate">
              <Icon.Star fill='yellow' color='Yellow' size={16} />
              {movie.vote_average % 1 === 0 ? movie.vote_average : movie.vote_average.toFixed(1)}
            </div>
          </div>
        </div>
      )
    })
  }

  const UpcomingMovieList = () => {
    return upcomingMovies.map((movie, i) => {
      return (
        <div className="Movie-wrapper" key={i}>
          <div className="Movie-image-container">
            <img className="Movie-image" src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`}/>
            <div className="Overlay">
              <div className="Overlay-content">{movie.overview}</div>
            </div>
          </div>
          <div className="Movie-title">{movie.title}</div>
          <div className="Movie-date">{movie.release_date}</div>
        </div>
      )
    })
  }

  const search = async (q) => {
    if (q.length > 1) {
      const query = await searchMovie(q)
      if (query.results.length === 0) {
        setSearchError("Film tidak ditemukan.")
        setPopularMovies([])
      } else {
        setSearchError(null)
        setPopularMovies(query.results)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>FLAXFLIX</h1>
        <input 
          placeholder="Mau nonton film apa hari ini?" 
          className="Movie-search"
          onChange={({ target }) => search(target.value)}
        />
      </header>
      <hr className="App-divider" />
      <body>
        <div className="Popular-Movie-list">
          <div>
            {searchError ? (
              <div className="ErrorMessage">
                <img src="/error.png" alt="" />
                <p>Maaf, film yang kamu cari tidak tersedia</p>
              </div>
            ) : (
            <div className="Category-title">
              <div>
                <img src="./garis.png" alt="" />
              </div>
              <h5>POPULER</h5>
            </div>
            )}
            <div className="Movie-container">
              {searchError ? null : <PopularMovieList />}
            </div>
          </div>
        </div>

        <hr className="Section-Separator" />

        <div className="Upcoming-Movie-list">
          <div>
            {searchError ? (null) : (
            <div className="Category-title">
              <div>
                <img src="./garis.png" alt="" />
              </div>
              <h5>YANG AKAN TAYANG</h5>
            </div>
            )}
            <div className="Movie-container">
              {searchError ? null : <UpcomingMovieList />} 
            </div>
          </div>
        </div>        
      </body>
    </div>
  )
}

export default App;
