import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMovies} from '../../hooks/useMovies';
import {movieSearchFetcher} from '../../../config/adapters/movieDB.adapter';
import {Movie} from '../../../core/entities/movie.entity';
import {MoviePoster} from '../../components/movies/MoviePoster';
import {FullScreenLoaders} from '../../components/loaders/FullScreenLoaders';

export const SearchMoviesScreen = ({navigation}: any) => {
  const {top} = useSafeAreaInsets();
  const {isLoding, nowPlaying} = useMovies();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const term = searchTerm.trim();

    if (term === '') {
      setFilteredMovies(nowPlaying);
      setSearching(false);
    } else {
      setSearching(true);
      movieSearchFetcher
        .get<{results: Movie[]}>('/search/movie', {
          params: {query: term}
        })
        .then(response => {
          const resultsWithPoster = (response.results || []).map(movie => ({
            ...movie,
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null
          }));

          setFilteredMovies(resultsWithPoster);
        })
        .catch(error => {
          console.error('Error al buscar películas:', error);
          setFilteredMovies([]);
        })
        .finally(() => {
          setSearching(false);
        });
    }
  }, [searchTerm, nowPlaying]);

  if (isLoding) {
    return <FullScreenLoaders />;
  }

  return (
    <View style={[styles.container, {paddingTop: top + 20}]}>
      <Text style={styles.title}>Buscar Película</Text>
      <TextInput
        placeholder="Buscar..."
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        autoCorrect={false}
      />

      {searching && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#007bff" />
        </View>
      )}

      <FlatList
        data={filteredMovies}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('MovieScreen', {id: item.id})}>
            <MoviePoster movie={item} height={250} width={150} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !searching && (
            <Text style={styles.noResults}>No se encontraron películas.</Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  list: {
    paddingBottom: 50
  },
  loader: {
    marginVertical: 10,
    alignItems: 'center'
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6c757d'
  }
});
