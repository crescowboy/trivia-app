import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../../../config/firebase/firebaseConfig';

export const TriviaDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params as {id: string};

  const [trivia, setTrivia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const fetchTrivia = async () => {
      try {
        const docRef = doc(db, 'trivias', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTrivia({id: docSnap.id, ...docSnap.data()});
        }
      } catch (error) {
        console.error('Error fetching trivia:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrivia();
  }, [id]);

  useEffect(() => {
    if (!trivia || !trivia.questions || finished) return;

    if (timeLeft === 0) {
      handleAnswer(null); // No se respondió a tiempo
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished, trivia]);

  const handleAnswer = (option: string | null) => {
    const current = trivia.questions[currentQuestionIndex];
    if (option === current.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setSelectedOption(option);

    setTimeout(() => {
      if (currentQuestionIndex < trivia.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setTimeLeft(10);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  if (!trivia) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trivia no encontrada.</Text>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trivia Finalizada</Text>
        <Text style={styles.score}>
          Tu puntuación: {score}/{trivia.questions.length}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = trivia.questions[currentQuestionIndex];

  if (!current || !Array.isArray(current.options)) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          La pregunta no está bien estructurada.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{trivia.title}</Text>
      <Text style={styles.description}>{trivia.description}</Text>

      <View style={styles.questionCard}>
        <View
          style={[
            styles.timerBadge,
            timeLeft <= 3 && styles.timerBadgeWarning
          ]}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>

        <Text style={styles.questionText}>
          {currentQuestionIndex + 1}. {current.question}
        </Text>
      </View>

      {current.options.map((option: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === option && styles.selectedOption
          ]}
          onPress={() => handleAnswer(option)}
          disabled={selectedOption !== null}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  questionCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative'
  },
  timerBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#007aff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  timerBadgeWarning: {
    backgroundColor: '#ff3b30'
  },
  timerText: {
    color: '#fff',
    fontSize: 16
  },
  questionText: {
    fontSize: 18
  },
  optionButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%'
  },
  selectedOption: {
    backgroundColor: '#d1e7dd'
  },
  optionText: {
    fontSize: 16
  },
  score: {
    fontSize: 18,
    marginVertical: 10
  },
  button: {
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center'
  }
});
