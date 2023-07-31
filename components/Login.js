import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard,TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import axios from 'axios';

//global variable
export let usernameValue = '';
export let userLastName = '';

// login function for all user types
const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('driver'); // Default user type is set to "parent"

  // Login function
  const handleLogin = () => {
    console.log('Username: ', username);
    console.log('Password: ', password);
    usernameValue = username;

    //create user data object
    const userData = {
      username: username, 
      password: password,
      userType: userType,
    };

    //using axios to send post request to server
    axios
      .post('https://h4uz91dxm6.execute-api.ap-southeast-1.amazonaws.com/dev/api/login', userData)
      .then((response) => {
        console.log('Response from server:', response.data);
        if (response.data.success) {
          const userLName = response.data.LName;
          userLastName = userLName;
          navigation.navigate('ScreenNav', { userType });
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        console.log('Error during login', error);
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Display
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container} behavior="position" keyboardVerticalOffset={0}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>MARSU-</Text>
          <Text style={styles.title}>PIUM-</Text>
        </View>
        <View>
          <Text style={styles.subTitleContainer}>Welcome back.</Text>
        </View>
        <View style={styles.inputView}>
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Username"
              placeholderTextColor="#56844B"
              onChangeText={(username) => setUsername(username)}
            />
          </View>
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#56844B"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
          <Text style={styles.btnText}>LOGIN</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 70,
    color: '#56844B',
    width: '80%',
  },
  titleContainer: {
    marginTop: 100,
    marginLeft: 35,
  },
  subTitleContainer: {
    color: '#56844B',
    marginLeft: 40,
    fontWeight: 'bold',
  },
  inputView: {
    marginVertical: 145,
    borderRadius: 25,
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: 25,
  },
  inputContainer: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#56844B',
    marginBottom: 10,
  },
  inputText: {
    height: 50,
    fontSize: 16,
    color: '#56844B',
  },
  loginBtn: {
    backgroundColor: '#56844B',
    marginVertical: 14,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 100,
    marginBottom: 50,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});