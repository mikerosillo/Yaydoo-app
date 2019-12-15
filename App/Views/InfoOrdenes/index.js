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

export default class Profile extends Component {
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
        console.log('from will', this.state.data)
    }
    // getAddress(data, tipo){
    //   console.log(tipo)
    //   if(tipo == 4){
    //     this.getAddressSolicitudes(data)
    //   } else {
    //     this.getAddressPo(data)
    //   }
    // }
    
   
    // howManyDaysAfter(date){
    //   // let dateStr = JSON.parse(date)
    //   var fecha = new Date(JSON.stringify(date));
     
    //   let dayCreated = Moment(date).format('D') // = 9
    //   let todaysDate = Moment(new Date()).format('D')
    //   var afterCreated = todaysDate - dayCreated
    //   if(afterCreated == 1){
    //     return <Text>Hace {afterCreated} d</Text>
    //   }else {
    //     return <Text>Hace {afterCreated} d</Text>
    //   }
    // };
    
    // getAddressPo(data){
    //   let arr = [data]
    //   let provider = arr.map((element)=>{
    //     return element.proposal.provider.address
    //   })
      
      // let address = provider.map((element)=>{
      //   return element.address
      // })
      // let city = provider.map((element)=>{
      //   return element.city
      // })
      // let zipCode = provider.map((element)=>{
      //   return element.zip_code
      // })
    //   return provider 
    // };
    // pendingPoLength(date){
    //   let arr = this.state.poDate
    //   var count = 0
    //   for(let i = 0; i < arr.length; i++){
    //      if(Moment(arr[i]).format('D MMM YY') == Moment(date).format('D MMM YY') ){
    //        count ++
    //      }
    //   }
    //   return count
    // };
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
    whichToRender(){
        let arr = [this.state.data]
        let name = arr.map((el , key)=>{
            return el.account.user.first_name
        })
        
        if(this.state.productos == true){
            return <View style={{flexDirection:'row'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Productos</Text>
                            <Text style={{color:'#000000'}}>Solicitante</Text>
                            <Text style={{color:'#000000'}}>Prioridad</Text>
                            <Text style={{color:'#000000'}}>Entrega</Text>
                            <Text style={{color:'#000000'}}>Direccion</Text>
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
                            <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Direccion</Text>
                            <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Fecha requerida</Text>
                        </View>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000', fontSize:15, fontWeight:'bold', marginTop:20, marginBottom:20}}></Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{name}</Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>Prioridad</Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20, fontWeight:'bold'}}></Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>Direccion</Text>
                            <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>Fecha requerida</Text>
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
