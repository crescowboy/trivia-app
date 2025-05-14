import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Movie} from '../../../core/entities/movie.entity';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../../navigation/Navigation';

interface Props {
  movie: Movie;
  height?: number;
  width?: number;
}

export const MoviePoster = ({movie, height = 420, width = 300}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const handlePress = () => {
    navigation.navigate('Details', {movieId: movie.id});
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => ({
        width,
        height,
        marginHorizontal: 5,
        paddingBottom: 20,
        paddingHorizontal: 5,
        opacity: pressed ? 0.9 : 1
      })}>
      <View style={[styles.imageContainer, {width, height}]}>
        {movie.poster ? (
          <Image style={styles.image} source={{uri: movie.poster}} />
        ) : (
          <View style={[styles.placeholder, {width, height}]}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 18
  },
  imageContainer: {
    flex: 1,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.24,
    shadowRadius: 7,
    elevation: 9,
    overflow: 'hidden'
  },
  placeholder: {
    backgroundColor: '#ccc',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10
  }
});
