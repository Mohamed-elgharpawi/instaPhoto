import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import PhotoList from '../components/photoList.js'

import { f, auth, database, storage } from '../../config/config'



export default class feed extends React.Component {

    

          // Do something when the screen is focused
    
    constructor(props) {
        super(props)
        this.state = {
            photo_feed:[],

            refresh: false,
            loading: true,


        }
      

    }
    
    
    componentDidMount = () => {



        
    }
   
   


    



    render() {

        return (

            <View style={styles.container}>


<PhotoList isUser={false}  navigation={this.props.navigation}/>

                    





            </View>

        );


    }





}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    topBar: {


        height: 70,
        paddingTop: 30,
        backgroundColor: "white",
        borderColor: 'lightgrey',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
