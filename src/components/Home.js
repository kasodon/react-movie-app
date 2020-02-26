import React, { Component } from 'react';
import {
  POPULAR_BASE_URL,
  SEARCH_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
  IMAGE_BASE_URL,
} from '../config';

// import Components
import HeroImage from './elements/HeroImage';
import SearchBar from './elements/SearchBar';
import Grid from './elements/Grid';
import MovieThumb from './elements/MovieThumb';
import LoadMoreBtn from './elements/LoadMoreBtn';
import Spinner from './elements/Spinner';

import NoImage from './images/no_image.jpg';

class Home extends Component {
  state = {
    movies: [],
    searchTerm: '',
    loading: true,
    error: false,
  };

  fetchMovies = async endpoint => {
    this.setState({ loading: true, error: false });

    const { searchTerm } = this.state;
    const isLoadMore = endpoint.search('page');

    try {
      const result = await (await fetch(endpoint)).json();
      this.setState(
        prev => ({
          ...prev,
          movies:
            isLoadMore !== -1
              ? [...prev.movies, ...result.results]
              : [...result.results],
          heroImage: prev.heroImage || result.results[0],
          currentPage: result.page,
          totalPages: result.total_pages,
          loading: false,
        }),
        () => {
          if (!searchTerm) {
            sessionStorage.setItem('homeState', JSON.stringify(this.state));
          }
        },
      );
    } catch (error) {
      this.setState({ error: true });
      console.log(error);
    }
  };

  componentDidMount() {
    if (sessionStorage.homeState) {
      this.setState(JSON.parse(sessionStorage.homeState));
    } else {
      this.fetchMovies(POPULAR_BASE_URL);
    }
  }

  searchMovies = search => {
    const endpoint = search ? SEARCH_BASE_URL + search : POPULAR_BASE_URL;

    this.setState({ searchTerm: search });
    this.fetchMovies(endpoint);
  };

  loadMoreMovies = () => {
    const { searchTerm, currentPage } = this.state;
    const searchEndpoint = `${SEARCH_BASE_URL}${searchTerm}&page=${currentPage +
      1}`;
    const popularEndpoint = `${POPULAR_BASE_URL}&page=${currentPage + 1}`;

    const endpoint = searchTerm ? searchEndpoint : popularEndpoint;

    this.fetchMovies(endpoint);
  };

  render() {
    const {
      searchTerm,
      heroImage,
      movies,
      currentPage,
      totalPages,
      loading,
      error,
    } = this.state;

    if (error) return <div>Something went wrong ...</div>;
    if (!movies[0]) return <Spinner />;

    return (
      <>
        {!searchTerm && (
          <HeroImage
            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
            title={heroImage.original_title}
            text={heroImage.overview}
          />
        )}
        <SearchBar callback={this.searchMovies} />
        <Grid header={searchTerm ? 'Search Result' : 'Popular Movies'}>
          {movies.map(movie => (
            <MovieThumb
              key={movie.id}
              clickable
              image={
                movie.poster_path
                  ? IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path
                  : NoImage
              }
              movieId={movie.id}
              movieName={movie.original_title}
            />
          ))}
        </Grid>
        {loading && <Spinner />}
        {currentPage < totalPages && !loading && (
          <LoadMoreBtn text="Load More" callback={this.loadMoreMovies} />
        )}
      </>
    );
  }
}

export default Home;
