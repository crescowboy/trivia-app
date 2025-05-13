import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

const RankingScreen = () => {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const db = getFirestore();
      const scoresRef = collection(db, 'scores');
      const q = query(scoresRef, orderBy('createdAt', 'desc')); // Ordenado por fecha
      const querySnapshot = await getDocs(q);

      const scoresByUser = new Map();

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const {uid, score, createdAt} = data;

        if (!uid) return;

        if (!scoresByUser.has(uid)) {
          scoresByUser.set(uid, {
            uid,
            email: data.email,
            displayName: data.displayName || '',
            total: 1,
            sum: score,
            lastScore: score,
            lastDate: createdAt
          });
        } else {
          const userData = scoresByUser.get(uid);
          userData.total += 1;
          userData.sum += score;
          // El primer documento es el más reciente por el orden
        }
      });

      const rankingArray = Array.from(scoresByUser.values()).map(user => ({
        ...user,
        avgScore: Math.round(user.sum / user.total)
      }));

      // Ordenar por puntaje promedio descendente
      rankingArray.sort((a, b) => b.avgScore - a.avgScore);

      setRanking(rankingArray);
      setLoading(false);
    };

    fetchScores();
  }, []);

  if (loading)
    return (
      <ActivityIndicator style={{marginTop: 50}} size="large" color="#007bff" />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Ranking de Puntajes</Text>
      <FlatList
        data={ranking}
        keyExtractor={(item, index) => item.uid || index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.item}>
            <Text style={styles.position}>{index + 1}.</Text>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.name}>{item.displayName || item.email}</Text>
              <Text style={styles.detail}>🎮 Partidas: {item.total}</Text>
              <Text style={styles.detail}>
                📈 Promedio: {item.avgScore} pts
              </Text>
              <Text style={styles.detail}>⏱ Último: {item.lastScore} pts</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default RankingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  position: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  detail: {
    fontSize: 14,
    color: '#555'
  }
});
