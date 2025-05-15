import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/home/HomeScreen';

import {SearchMoviesScreen} from '../screens/search/SearchMoviesScreen';
import RankingScreen from '../screens/ranking/RankingScree';

const Tab = createBottomTabNavigator();

export const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false
    }}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{title: 'Inicio'}}
    />
    <Tab.Screen
      name="Ranking"
      component={RankingScreen}
      options={{title: 'Ranking'}}
    />
    <Tab.Screen
      name="Buscar"
      component={SearchMoviesScreen}
      options={{title: 'Buscar'}}
    />
  </Tab.Navigator>
);
