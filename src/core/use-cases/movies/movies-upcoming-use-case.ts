import {HttpAdapter} from '../../../config/adapters/http/http.adapter';
import {MovieDBMoviesResponse} from '../../../infrastructure/interfaces/movie-db.responses';
import {MovieMapper} from '../../../infrastructure/mappers/movie.mapper';
import {Movie} from '../../entities/movie.entity';

export const moviesUpComingUseCase = async (
  fetcher: HttpAdapter
): Promise<Movie[]> => {
  try {
    const upComing = await fetcher.get<MovieDBMoviesResponse>('/upcoming');
    return upComing.results.map(result =>
      MovieMapper.fromMovieDBResultToEntity(result)
    );
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching movies - upcoming');
  }
};
