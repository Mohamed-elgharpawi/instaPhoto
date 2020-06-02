import React from 'react';
import { StyleSheet, Text, View, Image, FlatList,TouchableOpacity } from 'react-native';

import { f, storage, auth, database } from '../../config/config.js'
import PhotoList from '../components/photoList.js'



export default class userProfile extends React.Component {

       
    constructor(props) {
        super(props)

        this.state = {

            loaded: false,
            name:'',
           username:'',
            avatar:'',
            userId:''
        }

    }
    checkParams=()=>{
        var params = this.props.route.params


        
if(params){

if(params.userId){
    this.setState.userId=params.userId
this.setState({

    userId:params.userId

});
this.fetchUserInfo(params.userId); 




}

}


//

    }
    fetchUserInfo = (userId)=>{
        var taht = this;
         
        


        /**  Calls Are Separated because of the security rules of firebase */
        database.ref('users').child(userId).child('username').once('value').then(function(snapshot){
            const exists =(snapshot.val()!=null);
            if(exists) data=snapshot.val();
           taht.setState({username:data})
            

            }).catch(error=>console.log(error));

            database.ref('users').child(userId).child('name').once('value').then(function(snapshot){
                const exists =(snapshot.val()!=null);
                if(exists) data=snapshot.val();
                taht.setState({name:data})
                
                }).catch(error=>console.log(error));
                
                database.ref('users').child(userId).child('avatar').once('value').then(function(snapshot){
                    const exists =(snapshot.val()!=null);
                    if(exists) data=snapshot.val();
                
                   taht.setState({avatar:data,loaded:true});
                    }).catch(error=>console.log(error));
                    








    }

    componentDidMount = () => {

        this.checkParams();

    }

    
 



    render() {

        return (




            <View style={styles.container}>


                {this.state.loaded == false ? (
                     <View><Text>Loading..</Text></View>)
                     
                     
                     
                     :(






<View style={{flex:1}}>


<View style={{justifyContent:'space-evenly',alignItems:'center',flexDirection:'row',paddingVertical:10}}>
    
    <Image source={{uri:this.state.avatar}} style={{marginLeft:10,width:100,height:100,borderRadius:50}}/>
    
    <View style={{marginRight:10}}>
        <Text>{this.state.name}</Text>
         <Text>{this.state.username}</Text>


    </View>

    
    
    </View>



   


    <PhotoList isUser={true} userId={this.state.userId} type={"anthorPro"} navigation={this.props.navigation}/>

    





</View>
                
                )}



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
