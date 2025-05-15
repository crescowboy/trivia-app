import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import {useMovies} from '../../hooks/useMovies';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PosterCarousel} from '../../components/movies/PosterCarousel';
import {HorizontalCarousel} from '../../components/movies/HorizontalCarousel';
import {FullScreenLoaders} from '../../components/loaders/FullScreenLoaders';
import {useAuth} from '../../../core/context/AuthContext';

export const HomeScreen = ({navigation}: any) => {
  const {top} = useSafeAreaInsets();
  const {isAuthenticated, logout} = useAuth();

  const {isLoding, nowPlaying, popular, topRated, upComing, popularNextPage} =
    useMovies();

  const handleTriviaNavigation = (category: string) => {
    console.log('Estado de autenticación:', isAuthenticated);
    if (!isAuthenticated) {
      navigation.navigate('AuthScreen', {redirectTo: 'TriviaScreen', category});
    } else {
      navigation.navigate('TriviaScreen', {category});
    }
  };

  if (isLoding) {
    return <FullScreenLoaders />;
  }

  return (
    <ScrollView>
      <View style={[styles.container, {marginTop: top + 20}]}>
        <Text style={styles.sectionTitle}>Selecciona una Trivia</Text>

        <TouchableOpacity
          style={styles.mainTriviaButton}
          onPress={() => handleTriviaNavigation('general')}>
          <Text style={styles.triviaButtonText}>Trivia General</Text>
        </TouchableOpacity>

        <View style={styles.triviaRow}>
          <TouchableOpacity
            style={styles.triviaButtonSmall}
            onPress={() => handleTriviaNavigation('releaseYear')}>
            <Text style={styles.triviaButtonText}>Año de Estreno</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.triviaButtonSmall}
            onPress={() => handleTriviaNavigation('title')}>
            <Text style={styles.triviaButtonText}>Título</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.triviaRow}>
          <TouchableOpacity
            style={styles.triviaButtonSmall}
            onPress={() => handleTriviaNavigation('language')}>
            <Text style={styles.triviaButtonText}>Idioma Original</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.triviaButtonSmall}
            onPress={() => handleTriviaNavigation('genre')}>
            <Text style={styles.triviaButtonText}>Género</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Películas</Text>
        <PosterCarousel movies={nowPlaying} />

        <TouchableOpacity
          style={styles.authButton}
          onPress={() => navigation.navigate('AuthScreen')}>
          <Text style={styles.triviaButtonText}>Ir a Login/Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.triviaButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <HorizontalCarousel
          movies={popular}
          title="Populares"
          loadNextPage={popularNextPage}
        />
        <HorizontalCarousel movies={topRated} title="Mejor calificadas" />
        <HorizontalCarousel movies={upComing} title="Próximamente" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  mainTriviaButton: {
    backgroundColor: '#007bff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center'
  },
  triviaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10
  },
  triviaButtonSmall: {
    backgroundColor: '#007bff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center'
  },
  triviaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  authButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center'
  }
});
