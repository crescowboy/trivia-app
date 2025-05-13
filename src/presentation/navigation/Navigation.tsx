import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../screens/home/HomeScreen';
import {DetailsScreen} from '../screens/details/DetailsScreen';
import {TriviaScreen} from '../screens/trivia/TriviaScreen';
import {AuthScreen} from '../screens/auth/AuthScreen';
import RankingScreen from '../screens/ranking/RankingScree';

export type RootStackParams = {
  Home: undefined;
  Details: {movieId: number};
  TriviaScreen: {category: string}; // Agregar el parámetro `category` para TriviaScreen
};

const Stack = createStackNavigator<RootStackParams>();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="TriviaScreen" component={TriviaScreen} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
      <Stack.Screen name="RankingScreen" component={RankingScreen} />
    </Stack.Navigator>
  );
};
