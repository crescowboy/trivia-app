import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image
} from 'react-native';
import {movieDBFetcher} from '../../../config/adapters/movieDB.adapter';
import {saveUserScore} from '../../../core/services/scoreService';

const genreMap: {[key: number]: string} = {
  28: 'Acción',
  12: 'Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familiar',
  14: 'Fantasía',
  36: 'Historia',
  27: 'Terror',
  10402: 'Música',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Ciencia ficción',
  10770: 'Película de TV',
  53: 'Suspenso',
  10752: 'Bélica',
  37: 'Western'
};

export const TriviaScreen = ({navigation, route}: any) => {
  const {category} = route.params;
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await movieDBFetcher.get('/popular');
        const movies = response.results;
        const shuffledMovies = movies.sort(() => Math.random() - 0.5);
        const generated: any[] = [];
        let index = 0;
        while (generated.length < 10 && index < shuffledMovies.length) {
          const movie = shuffledMovies[index];
          const type = Math.floor(Math.random() * 4);
          let q = null;
          const make = (t: number) => {
            switch (t) {
              case 0:
                return {
                  question: '¿En qué año se estrenó esta película?',
                  poster: movie.poster_path,
                  options: [
                    movie.release_date.split('-')[0],
                    (parseInt(movie.release_date.split('-')[0]) - 1).toString(),
                    (parseInt(movie.release_date.split('-')[0]) + 1).toString(),
                    (parseInt(movie.release_date.split('-')[0]) + 2).toString()
                  ].sort(() => Math.random() - 0.5),
                  answer: movie.release_date.split('-')[0]
                };
              case 1:
                const others = shuffledMovies
                  .filter(m => m.id !== movie.id)
                  .slice(0, 3)
                  .map(m => m.title);
                return {
                  question: '¿Cuál es el título de esta película?',
                  poster: movie.poster_path,
                  options: [movie.title, ...others].sort(
                    () => Math.random() - 0.5
                  ),
                  answer: movie.title
                };
              case 2:
                return {
                  question: '¿Cuál es el idioma original de esta película?',
                  poster: movie.poster_path,
                  options: ['jp', 'es', 'fr', movie.original_language]
                    .slice(0, 4)
                    .sort(() => Math.random() - 0.5),
                  answer: movie.original_language
                };
              case 3:
                const genre = genreMap[movie.genre_ids[0]] || 'Desconocido';
                const otherG = Object.values(genreMap)
                  .filter(g => g !== genre)
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3);
                return {
                  question: '¿Cuál es el género principal de esta película?',
                  poster: movie.poster_path,
                  options: [genre, ...otherG].sort(() => Math.random() - 0.5),
                  answer: genre
                };
              default:
                return null;
            }
          };
          if (category === 'general') q = make(type);
          else if (category === 'releaseYear') q = make(0);
          else if (category === 'title') q = make(1);
          else if (category === 'language') q = make(2);
          else if (category === 'genre') q = make(3);
          if (q) generated.push(q);
          index++;
        }
        setQuestions(generated);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category]);

  useEffect(() => {
    if (timeLeft === 0) return handleAnswer(null);
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (opt: string | null) => {
    const cur = questions[currentQuestionIndex];
    if (opt === cur?.answer) setScore(score + 1);
    setSelectedOption(opt);
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setTimeLeft(10);
      } else {
        setFinished(true);
        saveUserScore(score);
      }
    }, 1000);
  };

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loaderText}>Cargando preguntas...</Text>
      </View>
    );

  if (finished) {
    const isWinner = score > 5;
    return (
      <ScrollView
        contentContainerStyle={[styles.container, styles.finishedContainer]}>
        <Text
          style={[
            styles.title,
            isWinner ? styles.titleWinner : styles.titleLoser
          ]}>
          {' '}
          {isWinner ? '¡Felicidades!' : 'Inténtalo de nuevo!'}
        </Text>
        <Text style={styles.score}>
          Tu puntuación: {score}/{questions.length}
        </Text>
        <Image
          source={
            isWinner
              ? require('../../../assets/Achievement-bro.png')
              : require('../../../assets/Bad-idea-pana.png')
          }
          style={styles.achievementImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Regresar al inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const current = questions[currentQuestionIndex];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      <Text style={styles.title}>Trivia de Películas</Text>
      {current.poster && (
        <Image
          source={{uri: `https://image.tmdb.org/t/p/w500${current.poster}`}}
          style={styles.poster}
        />
      )}
      <Text style={styles.question}>{current.question}</Text>
      {current.options.map((opt: string, i: number) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.optionButton,
            selectedOption === opt
              ? opt === current.answer
                ? styles.correctOption
                : styles.incorrectOption
              : null
          ]}
          onPress={() => handleAnswer(opt)}
          disabled={!!selectedOption}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.score}>
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    padding: 20
  },
  timerContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: '#343a40',
    padding: 10,
    borderRadius: 8
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16
  },
  finishedContainer: {
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  titleWinner: {
    color: '#28a745'
  },
  titleLoser: {
    color: '#92E3A9'
  },
  score: {
    fontSize: 18,
    marginBottom: 20
  },
  achievementImage: {
    width: 300,
    height: 300,
    marginVertical: 20
  },
  button: {
    marginTop: 20,
    backgroundColor: '#92E3A9',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 20
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  optionButton: {
    backgroundColor: '#dee2e6',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: '100%'
  },
  correctOption: {
    backgroundColor: '#28a745'
  },
  incorrectOption: {
    backgroundColor: '#dc3545'
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center'
  }
});
