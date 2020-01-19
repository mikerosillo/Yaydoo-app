import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    goToLogin() {
        Actions.login()
    }
    componentDidMount() {
        setTimeout(() => {
            this.goToLogin()
        }, 3000);
    };
    render() {
        return (
            <View style={styles.container}> 
            <Image 
                style={{ width: 350, height: 300}}
                source={require('../../../assets/appstore.png')} /> 
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        width:'100%',
        height:'100%',
        backgroundColor: '#2a2a33',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center' 
    }
});