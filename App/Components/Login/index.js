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
        {/* <View style={{ flex: 1 }}></View> */}
        <View style={{ justifyContent:'center', alignItems:'center', marginBottom:20  }}>
          <Image
            style={styles.yayImage}
            resizeMode={'contain'}
            source={require('../../../assets/yay.png')}
          />
          <Text style={{color:'rgba(60,60,67,0.6)', fontFamily:'Montserrat-Regular', fontSize:16.1}}>Simplifica y controla tus compras</Text>
        </View>
        <View style={{ flex: 1, width: 328, marginBottom:-40 }}>
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
          <Text style={{color:'rgba(60,60,67,0.6)', marginTop:10, fontFamily:'Montserrat-Regular', fontSize:16.1}}>¿Olvidaste tu contraseña?</Text>
          <View style={{  width: '100%', alignItems: 'center', marginTop:30 }}>
          <TouchableOpacity onPress={this.validate_field.bind(this)} style={styles.buttonLogin}>
            <Text style={styles.buttonText}>INGRESAR</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems:'center',marginTop:170}}>
          <Text style={{color:'rgba(60,60,67,0.6)',fontSize:17, marginBottom:20}}>Ir a yaydoo.com</Text>
        </View>
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
    // width: Dimensions.get('window').width - 230,
    marginTop:64,
    marginLeft:92,
    marginRight:92.25,
    width: 175.75,
    resizeMode: "contain",
    height: 76,
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
    backgroundColor: '#00A0F8',
    height: 46,
    width: 328,
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5,
  },
  buttonText: {
    fontSize: 13.96,
    color: '#ffffff',
    alignSelf: 'center',
    fontWeight: '100'
  },
})
export default Login;
