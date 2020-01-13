import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LOGOSVG from "../../../assets/logo-yaydoo.svg"


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
           
                <View style={styles.MainContainer}>
                    <LOGOSVG style={{marginTop:10}}
                        width="400px"
                        height="350px"
                    />
                    {/* <SvgUri width="200" height="200" source={require('../../../assets/logo-yaydoo.svg')} /> */}
                    
                </View>
            
        );
    }
}
const styles = StyleSheet.create({
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    MainContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor:'#2a2a33',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
});