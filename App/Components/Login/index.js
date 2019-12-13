import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Text,
  Image,
  View,
  Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux'; // react router to navigate in app
import { TextField } from 'react-native-materialui-textfield';
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    }
  };
  functionToGoToProfileView() {
    //to navigate to profile view
    Actions.profile()
  };
  validate_field() {
    let email = this.state.email;
    let password = this.state.password
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.length >= 1) {
      if (reg.test(this.state.email) === true) {
        this.onLoginPressed(password);
      }
      else {
        Alert.alert('Correo invalido');
      }
    } else {
      Alert.alert('Correo requerido')
    }
  };
  goToProfile() {
    Actions.profile()
}
  async onLoginPressed(password) {
    //operates asynchronously via the event loop, using an implicit Promise to return its result, this way we make sure to always store the access token if response.ok.
    if (password.length == 0) {
      Alert.alert('Contraseña requerida')
    } else if (password.length >= 6 && password.length <= 20) {
      await fetch('https://stage.ws.yay.do/account/authenticate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: this.state.password,
          email: this.state.email,
        }),
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              let access_token = data.access_token
              let enterprise_uuid = data.account.enterprise.uuid
              AsyncStorage.setItem('ACCESS_TOKEN', access_token);
              AsyncStorage.setItem('UUID', enterprise_uuid);
              this.functionToGoToProfileView()
            }).catch((err) => {
              console.warn(err.message)
            })
          } else {
              // this.goToProfile()
            Alert.alert('Correo y/o contraseña incorrectos')
          }
        })
        .catch(err => console.warn(err.message));
    } else {
      Alert.alert(
        'Verificar que:', 'La contraseña ingresada contenga un minimo de 6 caracteres y no más de 20.',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1 }}>
          <Image
            style={styles.yayImage}
            resizeMode={'contain'}
            source={require('../../../assets/yay.png')}
          />
        </View>
        <View style={{ flex: 1, width: '80%' }}>
          <TextField
            label="Correo"
            onChangeText={val => this.setState({ email: val })} //mutate the value of our global variable email at input
            lineWidth={1}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.Password.focus();
            }}
            blurOnSubmit={false}

          />
          <TextField
            label="Contraseña"
            onChangeText={val => this.setState({ password: val })} //mutate the value of our global variable password at input
            lineWidth={1}
            ref={(input) => {
              this.Password = input;
            }}

            secureTextEntry
          />
        </View>
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          <TouchableOpacity onPress={this.validate_field.bind(this)} style={styles.buttonLogin}>
            <Text style={styles.buttonText}>INGRESAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  };
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#ffffff',
  },
  yayImage: {
    width: Dimensions.get('window').width - 230,
    resizeMode: "contain",
    height: 70,
    marginRight: 40
  },
  input: {
    color: "black",
    marginRight: 24,
    marginLeft: 24,
    fontSize: 18,
    backgroundColor: 'transparent',
    height: 50,
    width: '100%',
  },
  buttonLogin: {
    backgroundColor: '#428efc',
    height: 50,
    width: '80%',
    marginTop: 40,
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    alignSelf: 'center',
    fontWeight: '100'
  },
})
export default Login;
