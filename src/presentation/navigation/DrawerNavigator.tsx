import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView
} from '@react-navigation/drawer';
import {BottomTabs} from './BottomTabs';
import {AuthScreen} from '../screens/auth/AuthScreen';
import {useAuth} from '../../core/context/AuthContext';
import {TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const {isAuthenticated, logout, user} = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View style={{alignItems: 'center', marginVertical: 30}}>
        <Icon name="person-circle-outline" size={80} color="#888" />
        <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
          {user?.name || 'Invitado'}
        </Text>
      </View>

      <View style={{paddingHorizontal: 20}}>
        {isAuthenticated ? (
          <TouchableOpacity
            onPress={logout}
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Icon
              name="log-out-outline"
              size={22}
              color="red"
              style={{marginRight: 10}}
            />
            <Text style={{color: 'red', fontWeight: 'bold'}}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('AuthScreen')}
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Icon
              name="log-in-outline"
              size={22}
              color="green"
              style={{marginRight: 10}}
            />
            <Text style={{color: 'green', fontWeight: 'bold'}}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            marginVertical: 15
          }}
        />

        <TouchableOpacity
          onPress={() => alert('Ir a Ajustes')}
          style={{
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Icon
            name="settings-outline"
            size={22}
            color="#333"
            style={{marginRight: 10}}
          />
          <Text style={{fontWeight: 'bold'}}>Ajustes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => alert('Acerca de esta app')}
          style={{
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Icon
            name="information-circle-outline"
            size={22}
            color="#333"
            style={{marginRight: 10}}
          />
          <Text style={{fontWeight: 'bold'}}>Acerca de</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.closeDrawer()}
          style={{
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Icon
            name="close-outline"
            size={22}
            color="#333"
            style={{marginRight: 10}}
          />
          <Text style={{fontWeight: 'bold'}}>Cerrar menú</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{headerShown: true}}>
    <Drawer.Screen name="Tabs" component={BottomTabs} />
    <Drawer.Screen name="AuthScreen" component={AuthScreen} />
  </Drawer.Navigator>
);
