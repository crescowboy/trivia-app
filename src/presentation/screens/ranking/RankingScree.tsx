import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FullScreenLoaders} from '../../components/loaders/FullScreenLoaders';

const RankingScreen = () => {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const db = getFirestore();
      const scoresRef = collection(db, 'scores');
      const q = query(scoresRef, orderBy('createdAt', 'desc'));
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
        }
      });

      const rankingArray = Array.from(scoresByUser.values()).map(user => ({
        ...user,
        avgScore: Math.round(user.sum / user.total)
      }));

      rankingArray.sort((a, b) => b.avgScore - a.avgScore);

      setRanking(rankingArray);
      setLoading(false);
    };

    fetchScores();
  }, []);

  if (loading) return <FullScreenLoaders />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Ranking de Puntajes</Text>
      <FlatList
        data={ranking}
        keyExtractor={(item, index) => item.uid || index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.row}>
            <Text style={styles.position}>{index + 1}</Text>

            <Ionicons
              name="person-circle-outline"
              size={30}
              color="#007bff"
              style={styles.icon}
            />

            <View style={styles.userInfo}>
              <Text numberOfLines={1} style={styles.email}>
                {item.displayName || item.email}
              </Text>
            </View>

            <View style={styles.scoreInfo}>
              <Text style={styles.score}>{item.avgScore} pts</Text>
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
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    elevation: 2
  },
  position: {
    width: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff'
  },
  icon: {
    marginHorizontal: 8
  },
  userInfo: {
    flex: 1
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  scoreInfo: {
    alignItems: 'flex-end'
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745'
  }
});
