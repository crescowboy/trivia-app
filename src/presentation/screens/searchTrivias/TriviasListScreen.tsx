import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView
} from 'react-native';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../../../config/firebase/firebaseConfig';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export const TriviasListScreen = () => {
  const [trivias, setTrivias] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTrivias = async () => {
      const querySnapshot = await getDocs(collection(db, 'trivias'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrivias(data);
    };

    fetchTrivias();
  }, []);

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.posterCard}
      onPress={() => navigation.navigate('TriviaDetail', {id: item.id})}>
      <Text style={styles.posterText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎬 Trivias de la comunidad</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateTriviaScreen')}>
        <Text style={styles.createButtonText}>➕ Crear nueva trivia</Text>
      </TouchableOpacity>

      <FlatList
        data={trivias}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f4f7'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333'
  },
  createButton: {
    backgroundColor: '#92E3A9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  list: {
    paddingBottom: 30
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16
  },
  posterCard: {
    backgroundColor: '#fff',
    paddingVertical: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  posterText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  }
});
