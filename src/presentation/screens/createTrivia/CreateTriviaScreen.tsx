import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';
import {db} from '../../../config/firebase/firebaseConfig';
import {collection, addDoc} from 'firebase/firestore';

export const CreateTriviaScreen = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(
    Array.from({length: 10}, () => ({
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0
    }))
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleChange = (field: string, value: string) => {
    const updatedQuestions = [...questions];
    if (field === 'question') {
      updatedQuestions[currentQuestionIndex].question = value;
    } else {
      const optionIndex = parseInt(field);
      updatedQuestions[currentQuestionIndex].options[optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleCorrectIndexChange = (value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].correctIndex = parseInt(value);
    setQuestions(updatedQuestions);
  };

  const validateCurrentQuestion = () => {
    const current = questions[currentQuestionIndex];
    if (!current.question.trim()) {
      Alert.alert('⚠️ Atención', 'La pregunta no puede estar vacía. ✍️');
      return false;
    }
    if (current.options.some(opt => !opt.trim())) {
      Alert.alert('⚠️ Atención', 'Todas las opciones deben estar llenas. ✅');
      return false;
    }
    if (
      isNaN(current.correctIndex) ||
      current.correctIndex < 0 ||
      current.correctIndex > 3
    ) {
      Alert.alert(
        '⚠️ Atención',
        'El índice de la respuesta correcta debe estar entre 0 y 3. 🧠'
      );
      return false;
    }
    return true;
  };

  const saveTrivia = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (
        !q.question.trim() ||
        q.options.some(o => !o.trim()) ||
        isNaN(q.correctIndex)
      ) {
        Alert.alert(
          '❌ Error',
          `Completa correctamente la pregunta ${i + 1}. 📝`
        );
        setCurrentQuestionIndex(i);
        return;
      }
    }

    if (!title.trim()) {
      Alert.alert('❌ Error', 'Agrega un título para la trivia. 🏷️');
      return;
    }

    try {
      await addDoc(collection(db, 'trivias'), {
        title,
        questions,
        createdAt: new Date()
      });
      Alert.alert('🎉 Éxito', '¡Trivia guardada correctamente! ✅');
      setTitle('');
      setQuestions(
        Array.from({length: 10}, () => ({
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0
        }))
      );
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error(error);
      Alert.alert(
        '🚫 Error',
        'No se pudo guardar la trivia. Intenta de nuevo. 🔁'
      );
    }
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) return;
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Trivia</Text>

      <TextInput
        style={styles.input}
        placeholder="Título de la trivia"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Pregunta {currentQuestionIndex + 1}</Text>
      <TextInput
        style={styles.input}
        placeholder="Texto de la pregunta"
        value={currentQuestion.question}
        onChangeText={text => handleChange('question', text)}
      />

      {currentQuestion.options.map((opt, idx) => (
        <TextInput
          key={idx}
          style={styles.input}
          placeholder={`Opción ${idx + 1}`}
          value={opt}
          onChangeText={text => handleChange(idx.toString(), text)}
        />
      ))}

      <Text style={styles.label}>Selecciona la respuesta correcta</Text>
      <View style={styles.optionsRow}>
        {currentQuestion.options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.optionButton,
              currentQuestion.correctIndex === idx &&
                styles.selectedOptionButton
            ]}
            onPress={() => handleCorrectIndexChange(idx.toString())}>
            <Text
              style={[
                styles.optionButtonText,
                currentQuestion.correctIndex === idx &&
                  styles.selectedOptionText
              ]}>
              {`Opción ${idx + 1}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            currentQuestionIndex === 0 && styles.disabledButton
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            currentQuestionIndex === 9 && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={currentQuestionIndex === 9}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      {currentQuestionIndex === 9 && (
        <TouchableOpacity
          style={[styles.button, {marginTop: 20}]}
          onPress={saveTrivia}>
          <Text style={styles.buttonText}>Guardar Trivia</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 6,
    borderRadius: 5
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    backgroundColor: '#92E3A9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    flex: 1
  },
  disabledButton: {
    opacity: 0.5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  optionButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
    width: '48%',
    alignItems: 'center'
  },
  selectedOptionButton: {
    backgroundColor: '#4CAF50'
  },
  optionButtonText: {
    color: '#333',
    fontWeight: 'bold'
  },
  selectedOptionText: {
    color: '#fff'
  }
});
