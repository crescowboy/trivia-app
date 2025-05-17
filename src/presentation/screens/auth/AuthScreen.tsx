import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import {Image} from 'react-native';
import {useAuth} from '../../../core/context/AuthContext';

export const AuthScreen = ({navigation, route}: any) => {
  const {login, register} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const {redirectTo, category} = route.params || {};

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert(
        '¡Bienvenido!',
        'Has iniciado sesión correctamente. 🎉\n\n¡Ya puedes comenzar a jugar la trivia!'
      );
      if (redirectTo) {
        navigation.navigate(redirectTo, {category});
      } else {
        navigation.navigate('Home');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      await register(email, password);
      Alert.alert(
        'Registro exitoso 🎊',
        'Tu cuenta ha sido creada correctamente.\n\n¡Ya puedes comenzar a jugar la trivia!'
      );
      if (redirectTo) {
        navigation.navigate(redirectTo, {category});
      } else {
        navigation.navigate('Home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
      </Text>
      <Image
        source={require('../../../assets/Mobile-login-bro.png')}
        style={{width: 300, height: 300, alignSelf: 'center'}}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={isRegistering ? handleRegister : handleLogin}>
        <Text style={styles.buttonText}>
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.toggleButtonText}>
          {isRegistering
            ? '¿Ya tienes una cuenta? Inicia sesión'
            : '¿No tienes una cuenta? Regístrate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#92E3A9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  toggleButtonText: {
    color: '#92E3A9',
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});
