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
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  createButton: {
    backgroundColor: '#92E3A9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15
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
    backgroundColor: '#e0e0e0',
    paddingVertical: 25,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: (width - 48) / 2, // two cards with 16px padding between them and sides
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  posterText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  }
});
