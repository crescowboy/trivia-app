import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView
} from '@react-navigation/drawer';
import {BottomTabs} from './BottomTabs';
import {AuthScreen} from '../screens/auth/AuthScreen';
import {useAuth} from '../../core/context/AuthContext';
import {TouchableOpacity, Text, View, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const {isAuthenticated, logout, user} = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View style={styles.header}>
        <Icon name="person-circle-outline" size={90} color="#4F8EF7" />
        <Text style={styles.username}>{user?.email || 'Invitado'}</Text>
      </View>

      <View style={styles.menuSection}>
        {isAuthenticated ? (
          <DrawerItem
            icon="log-out-outline"
            label="Cerrar sesión"
            color="red"
            onPress={logout}
          />
        ) : (
          <DrawerItem
            icon="log-in-outline"
            label="Iniciar sesión"
            color="green"
            onPress={() => props.navigation.navigate('AuthScreen')}
          />
        )}

        <View style={styles.separator} />

        <DrawerItem
          icon="settings-outline"
          label="Ajustes"
          onPress={() => alert('Ir a Ajustes')}
        />
        <DrawerItem
          icon="information-circle-outline"
          label="Acerca de"
          onPress={() => alert('Acerca de esta app')}
        />
        <DrawerItem
          icon="close-outline"
          label="Cerrar menú"
          onPress={() => props.navigation.closeDrawer()}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 TriviaApp</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const DrawerItem = ({
  icon,
  label,
  onPress,
  color = '#333'
}: {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Icon name={icon} size={22} color={color} style={{marginRight: 15}} />
    <Text style={[styles.itemText, {color}]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f0f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333'
  },
  menuSection: {
    padding: 20
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600'
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16
  },
  footer: {
    marginTop: 'auto',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9'
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888'
  }
});

export const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{headerShown: false}}>
    <Drawer.Screen
      name="Tabs"
      component={BottomTabs}
      options={{
        drawerItemStyle: {display: 'none'}
      }}
    />

    <Drawer.Screen name="AuthScreen" component={AuthScreen} />
  </Drawer.Navigator>
);
