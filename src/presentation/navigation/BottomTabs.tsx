import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/home/HomeScreen';
import {SearchMoviesScreen} from '../screens/search/SearchMoviesScreen';
import RankingScreen from '../screens/ranking/RankingScree';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TriviasListScreen} from '../screens/searchTrivias/TriviasListScreen';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#92E3A9'
        },
        headerTintColor: '#fff',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{marginLeft: 15}}>
            <Ionicons name="menu-outline" size={28} color="#fff" />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: '#92E3A9',
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 10
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        tabBarIcon: ({color, size}) => {
          let iconName = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Ranking') iconName = 'trophy-outline';
          if (route.name === 'Buscar') iconName = 'search-outline';
          if (route.name === 'Crear Trivia') iconName = 'add-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}>
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
        name="Crear Trivia"
        component={TriviasListScreen}
        options={{title: 'Crear Trivia'}}
      />
      <Tab.Screen
        name="Buscar"
        component={SearchMoviesScreen}
        options={{title: 'Buscar'}}
      />
    </Tab.Navigator>
  );
};
