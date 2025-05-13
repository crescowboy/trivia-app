import {FullMovie} from '../../core/entities/movie.entity';
import {MovieDBMovie, Result} from '../interfaces/movie-db.responses';

export class MovieMapper {
  static fromMovieDBResultToEntity(result: Result): Movie {
    return {
      id: result.id,
      tittle: result.title,
      description: result.overview,
      releaseDate: new Date(result.release_date),
      rating: result.vote_average,
      poster: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/w500${result.backdrop_path}`
    };
  }

  static fromMovieDBToEntity(movie: MovieDBMovie): FullMovie {
    return {
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      releaseDate: new Date(movie.release_date),
      rating: movie.vote_average,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
      genres: movie.genres.map(genre => genre.name),
      duration: movie.runtime,
      bubget: movie.budget,
      originalTitle: movie.original_title,
      productionCompanies: movie.production_companies.map(
        company => company.name
      )
    };
  }
}
