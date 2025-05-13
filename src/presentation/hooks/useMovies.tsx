import React, {useEffect, useState} from 'react';
import {Movie} from '../../core/entities/movie.entity';

import * as UseCases from '../../core/use-cases';
import {movieDBFetcher} from '../../config/adapters/movieDB.adapter';

let popularPageNumber = 1;

export const useMovies = () => {
  const [isLoding, setIsLoding] = useState(true);
  const [nowPlaying, setnowPlaying] = useState<Movie[]>([]);
  const [popular, setpopular] = useState<Movie[]>([]);
  const [topRated, settopRated] = useState<Movie[]>([]);
  const [upComing, setupComing] = useState<Movie[]>([]);

  useEffect(() => {
    initialLoad();
  }, []);

  const initialLoad = async () => {
    const nowPlayingPromise = await UseCases.moviesNowPlayingUseCase(
      movieDBFetcher
    );
    const popularPromise = await UseCases.moviesPopularUseCase(movieDBFetcher);
    const topRatedPromise = await UseCases.moviesTopRatedUseCase(
      movieDBFetcher
    );
    const upcomingPromise = await UseCases.moviesUpComingUseCase(
      movieDBFetcher
    );

    const [nowPlayingMovies, popularMovies, topRatedMovies, upComingMovies] =
      await Promise.all([
        nowPlayingPromise,
        popularPromise,
        topRatedPromise,
        upcomingPromise
      ]);

    setnowPlaying(nowPlayingMovies);
    setpopular(popularMovies);
    settopRated(topRatedMovies);
    setupComing(upComingMovies);

    setIsLoding(false);

    // console.log(
    //   nowPlayingMovies,
    //   popularMovies,
    //   topRatedMovies,
    //   upComingMovies,
    // );
  };
  return {
    isLoding,
    nowPlaying,
    popular,
    topRated,
    upComing,

    //Methods
    popularNextPage: async () => {
      popularPageNumber++;
      const popularMovies = await UseCases.moviesPopularUseCase(
        movieDBFetcher,
        {
          page: popularPageNumber
        }
      );

      setpopular(prev => [...prev, ...popularMovies]);
    }
  };
};
