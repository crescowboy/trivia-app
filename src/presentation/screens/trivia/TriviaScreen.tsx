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

        const generatedQuestions: any[] = [];
        let index = 0;

        while (
          generatedQuestions.length < 10 &&
          index < shuffledMovies.length
        ) {
          const movie = shuffledMovies[index];
          const questionType = Math.floor(Math.random() * 4); // 0: year, 1: title, 2: language, 3: genre
          let question = null;

          const generateQuestion = (type: number) => {
            switch (type) {
              case 0:
                return {
                  question: `¿En qué año se estrenó esta película?`,
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
                const otherMovies = shuffledMovies
                  .filter((m: any) => m.id !== movie.id)
                  .slice(0, 3)
                  .map((m: any) => m.title);
                return {
                  question: `¿Cuál es el título de esta película?`,
                  poster: movie.poster_path,
                  options: [movie.title, ...otherMovies].sort(
                    () => Math.random() - 0.5
                  ),
                  answer: movie.title
                };
              case 2:
                return {
                  question: `¿Cuál es el idioma original de esta película?`,
                  poster: movie.poster_path,
                  options: ['jp', 'es', 'fr', movie.original_language]
                    .slice(0, 4)
                    .sort(() => Math.random() - 0.5),
                  answer: movie.original_language
                };
              case 3:
                const genreName = genreMap[movie.genre_ids[0]] || 'Desconocido';
                const otherGenres = Object.values(genreMap)
                  .filter(g => g !== genreName)
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3);
                return {
                  question: `¿Cuál es el género principal de esta película?`,
                  poster: movie.poster_path,
                  options: [genreName, ...otherGenres].sort(
                    () => Math.random() - 0.5
                  ),
                  answer: genreName
                };
              default:
                return null;
            }
          };

          if (category === 'general') {
            question = generateQuestion(questionType);
          } else if (
            category === 'releaseYear' &&
            [0, 1, 2, 3].includes(questionType)
          ) {
            question = generateQuestion(0);
          } else if (
            category === 'title' &&
            [0, 1, 2, 3].includes(questionType)
          ) {
            question = generateQuestion(1);
          } else if (
            category === 'language' &&
            [0, 1, 2, 3].includes(questionType)
          ) {
            question = generateQuestion(2);
          } else if (
            category === 'genre' &&
            [0, 1, 2, 3].includes(questionType)
          ) {
            question = generateQuestion(3);
          }

          if (question) {
            generatedQuestions.push(question);
          }

          index++;
        }

        setQuestions(generatedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (selectedOption: string | null) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion?.answer) {
      setScore(score + 1);
    }

    setSelectedOption(selectedOption);

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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (finished) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Trivia Finalizada</Text>
        <Text style={styles.score}>
          Tu puntuación: {score}/{questions.length}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>
            Regresar a la pantalla principal
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      <Text style={styles.title}>Trivia de Películas</Text>
      {currentQuestion.poster && (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${currentQuestion.poster}`
          }}
          style={styles.poster}
        />
      )}
      <Text style={styles.question}>{currentQuestion.question}</Text>
      {currentQuestion.options.map((option: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === option
              ? option === currentQuestion.answer
                ? styles.correctOption
                : styles.incorrectOption
              : null
          ]}
          onPress={() => handleAnswer(option)}
          disabled={!!selectedOption}>
          <Text style={styles.optionText}>{option}</Text>
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
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
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
  },
  score: {
    marginTop: 20,
    fontSize: 16
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
