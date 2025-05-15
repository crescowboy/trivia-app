import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabs} from './BottomTabs';
import {DetailsScreen} from '../screens/details/DetailsScreen';
import {TriviaScreen} from '../screens/trivia/TriviaScreen';
import {AuthScreen} from '../screens/auth/AuthScreen';

export type RootStackParams = {
  MainTabs: undefined;
  Details: {movieId: number};
  TriviaScreen: {category: string};
  AuthScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="TriviaScreen" component={TriviaScreen} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
    </Stack.Navigator>
  );
};
