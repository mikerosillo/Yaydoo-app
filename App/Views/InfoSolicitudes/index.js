import React, { Component } from 'react';
import {
    StyleSheet,
    Alert,
    AsyncStorage,
    Text,
    View,
    ScrollView,
    RefreshControl,
    ImageBackground,
    TouchableOpacity,
    Image,
    Button,
    Dimensions,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { ListItem } from 'native-base';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import Moment from 'moment';
var numeral = require('numeral');

export default class InfoSolicitudes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            folio:'',
            informacion: true,
            productos: false,
        }
    };
    
    previewsPage(){
      Actions.profile()
    };
    UNSAFE_componentWillMount(){
        this.state.data = this.props.data
        this.state.folio = this.props.folio
        this.getPoInfo()
    }
    informacionTitleStyle(){
        if(this.state.informacion == true){
            return {
                textDecorationLine: 'underline',
                color:'#FFF', 
                marginLeft:20, 
                fontSize:18
            }
        } else {
            return {
                color:'#FFF', 
                marginLeft:20, 
                fontSize:18
            }
        }
    };
    productosTitleStyle(){
        if(this.state.productos == true){
            return {
                textDecorationLine: 'underline',
                color:'#FFF', 
                marginLeft:20, 
                fontSize:18
            }
        } else {
            return {
                color:'#FFF', 
                marginLeft:20, 
                fontSize:18
            }
        }
    };
   async getPoInfo(){
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        const uuid = await AsyncStorage.getItem('UUID');
        if (token && uuid) { // if user is logged in
            await fetch(`https://stage.ws.yay.do/v2/enterprise/${uuid}/purchaseOrder/74960-2997263`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "X-Auth-Token": token
                },

            })
                .then((response) => {
                    console.log(response.json())
                  
                    // if (response.ok) {
                    //     response.json().then((datos) => {
                    //          // var ultimaFecha = Moment(lastDate[0]).format('D MMM YY')
                    //       console.log(datos)
                    //       // console.log(datos.data.approved)
                    //       // console.log(datos.data.internal)
                          
                    //         // let solicitudes = datos.data
                    //         // let name = codes[0].account.user.first_name

                            
                    //     })
                    // }
                })
                .catch(err => console.warn(err.message));
        } 
    }
    whichToRender(){
        let arr = [this.state.data]
        let name = arr.map((el)=>{
            return el.account.user.first_name
        });
        let priority = arr.map((el)=>{
            var res=''
            if(el.priority == '1'){
                 res = 'Muy alta'
            } else if(el.priority == '2'){
                res = 'Alta'
            } else if(el.priority == '3'){
                res = 'Media'
            } else if(el.priority == '4'){
                res = 'Baja'
            } else {
                res = 'Muy baja'
            }
            return res
        });
        let address = arr.map((el)=>{
            return el.shipping.address.entity.name
        })
        if(this.state.productos == true){
            return <View style={{flexDirection:'row'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Productos</Text>
                            <Text style={{color:'#000000'}}>Solicitante</Text>
                            <Text style={{color:'#000000'}}>Prioridad</Text>
                            <Text style={{color:'#000000'}}>Entrega</Text>
                            <Text style={{color:'#000000'}}>Dirección</Text>
                            <Text style={{color:'#000000'}}>Fecha requerida</Text>
                        </View>
                        <View style={{width:'50%'}}></View>
                    </View>
        } else {      
           return   <View style={{flexDirection:'row'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000', marginLeft:20, fontSize:15, fontWeight:'bold', marginTop:20, marginBottom:20}}>Detalle</Text>
                            <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Solicitante</Text>
                            <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Prioridad</Text>
                            <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20, fontWeight:'bold'}}>Entrega</Text>
                            <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Dirección</Text>
                            <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Fecha requerida</Text>
                        </View>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000', fontSize:15, fontWeight:'bold', marginTop:20, marginBottom:20}}></Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{name}</Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{priority}</Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20, fontWeight:'bold'}}></Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{address}</Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{Moment().format('D MMM YY')}</Text>
                        </View>   
                    </View>
                   
        }
    }
   
    render() {
        return (
            <View style={styles.container}>
                <View style={{backgroundColor:'#4180fd'}}>
                    <View style={{flexDirection:'row', marginTop:20}}>
                        <View style={{width:'50%', flexDirection:'row'}}>
                           <View style={{width:'40%', justifyContent:'center'}}>
                                <TouchableOpacity  onPress={() => this.previewsPage()}>
                                    <Image
                                        source={require('../../../assets/icons8-chevron-left-48.png')}
                                        // source={{uri : 'assets/icons8-chevron-left-48.png'}}
                                        style={{ width: 15, height: 15, marginLeft: 20,color:'#FFF'}}
                                    />
                                </TouchableOpacity>
                           </View>
                           <View style={{width:'60%'}}>
                               <Text style={{color:'#FFF', fontSize:20}}># {this.state.folio}</Text>
                           </View>
                        </View>
                        <View style={{width:'50%'}}></View>
                    </View>
                    <View style={{ flexDirection:'row', marginTop:20, marginBottom:20}}>
                        <View style={{width:'50%'}}>
                            <TouchableOpacity  onPress={() => this.setState({informacion: true, productos: false})}>
                                <Text style={this.informacionTitleStyle()}>INFORMACION</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'50%'}}>
                        
                  

                            <TouchableOpacity onPress={() => this.setState({productos: true, informacion: false})}> 
                                <Text style={this.productosTitleStyle()}>PRODUCTOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView style={{marginTop:0}}>
                    {this.whichToRender()}
    
                </ScrollView>
            </View> 
        )
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",

    },
})
