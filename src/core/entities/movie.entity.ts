export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: Date;
  rating: number;
  poster: string;
  backdrop: string;
}

export interface FullMovie extends Movie {
  genres: string[];
  duration: number;
  bubget: number;
  originalTitle: string;
  productionCompanies: string[];
}
