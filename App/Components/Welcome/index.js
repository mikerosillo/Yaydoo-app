import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
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
            <ImageBackground style={styles.imgBackground}
                resizeMode='cover'
                source={require('../../../assets/imageSplash.jpg')}>
                <View style={styles.MainContainer}>
                   
                </View>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
});