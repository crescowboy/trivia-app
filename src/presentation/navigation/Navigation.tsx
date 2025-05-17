import {createStackNavigator} from '@react-navigation/stack';
import {DrawerNavigator} from './DrawerNavigator';
import {DetailsScreen} from '../screens/details/DetailsScreen';
import {TriviaScreen} from '../screens/trivia/TriviaScreen';
import {TriviaDetailScreen} from '../screens/triviaDetails/TriviaDetailScreen';
import {CreateTriviaScreen} from '../screens/createTrivia/CreateTriviaScreen';

export type RootStackParams = {
  Drawer: undefined;
  Details: {movieId: number};
  TriviaScreen: {category: string};
};

const Stack = createStackNavigator<RootStackParams>();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="TriviaScreen" component={TriviaScreen} />
      <Stack.Screen name="TriviaDetail" component={TriviaDetailScreen} />
      <Stack.Screen name="createTrivia" component={CreateTriviaScreen} />
    </Stack.Navigator>
  );
};
