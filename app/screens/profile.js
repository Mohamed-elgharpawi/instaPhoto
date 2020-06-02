import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity ,TextInput} from 'react-native';

import { f, storage, auth, database } from '../../config/config.js'
import PhotoList from '../components/photoList.js'


export default class profile extends React.Component {

       
    constructor(props) {
        super(props)

        this.state = {

            //loggedin: false,
            pro:props,
        }
    }

    getUserInfo=(userId)=>{
        var that=this

        database.ref('users').child(userId).once('value').then(function(snapshot){
const exists=(snapshot.val()!=null);

if(exists){
    data=snapshot.val();


that.setState({
username:data.username,
name:data.name,
avatar:data.avatar,
loggedin:true,
userId:f.auth().currentUser.uid



});

}

        }).catch(err=>console.log(err));


    }

    componentDidMount = () => {
        

        this.getUserInfo(f.auth().currentUser.uid);


    }
logout=()=>{
    f.auth().signOut();

    alert('logged out !')
    this.props.navigation.replace('Login')

}

editProfile=()=>{

    this.setState({editingProfile:true})


}
saveProfile=()=>{
var name= this.state.name;
var username=this.state.username;

if(name!=''){

database.ref('users').child(this.state.userId).child('name').set(name);

}

if(username!=''){

    database.ref('users').child(this.state.userId).child('username').set(username);
    
    }

    this.setState({editingProfile:false});




}




    render() {

        return (




            <View style={styles.container}>


            
<View style={{flex:1}}>


<View style={{justifyContent:'space-evenly',alignItems:'center',flexDirection:'row',paddingVertical:10}}>
    
    <Image source={{uri:this.state.avatar}} style={{marginLeft:10,width:100,height:100,borderRadius:50}}/>
    
    <View style={{marginRight:10}}>
                <Text>{this.state.name}</Text>
                <Text>{this.state.username}</Text>


    </View>

    </View>

   
    
  

{this.state.editingProfile == true? (
  <View style={{alignItems:'center',justifyContent:'center',paddingBottom:10,borderBottomWidth:1}}>
<TouchableOpacity onPress={()=>this.setState({editingProfile:false})}>
<Text style={{fontWeight:'bold'}}>Cancel Editing</Text>

</TouchableOpacity>
<Text>Name: </Text>

<TextInput
editable={true}
placeholder={'Enter your name'}
onChangeText={(text)=>this.setState({name:text})}
value={this.state.name}
style={{width:250,marginVertical:10,padding:5,borderColor:'gray',borderWidth:1}}
/>

<Text>Username: </Text>

<TextInput
editable={true}
placeholder={'Enter your username'}
onChangeText={(text)=>this.setState({username:text})}
value={this.state.username}
style={{width:250,marginVertical:10,padding:5,borderColor:'gray',borderWidth:1}}
/>

<TouchableOpacity
style={{backgroundColor:'green',padding:10}}
onPress={()=>this.saveProfile()}>
<Text style={{fontWeight:'bold'}}> Save</Text>

</TouchableOpacity>

      </View>



):(
  <View style={{paddingBottom:10,borderBottomWidth:1}}>
  <View style={{justifyContent:'space-evenly',flexDirection:'row'}}>
    <TouchableOpacity 
    
    onPress={()=>this.logout()}
    style={{marginTop:10,width:100,padding:10,borderRadius:20,borderWidth:1.5}}>
        <Text style={{textAlign:'center',color:'grey'}}>Logout</Text>

        </TouchableOpacity>


        <TouchableOpacity 
        onPress={()=>this.editProfile()}
        
        style={{marginTop:10,width:100,padding:10,borderRadius:20,borderWidth:1.5}}>
        <Text style={{textAlign:'center',color:'grey'}}>Edit</Text>

        </TouchableOpacity>

        </View>


    <TouchableOpacity 
     onPress={() => this.state.pro.navigation.navigate('Upload')}
        style={{marginTop:10,marginHorizontal:40,paddingVertical:10,backgroundColor:'blue',borderRadius:20,borderWidth:1.5}}>
        <Text style={{textAlign:'center',color:'white'}}>Upload New +</Text>

        </TouchableOpacity>


       

    </View>
   

   )}
    <PhotoList isUser={true} userId={this.state.userId} type={"mypro"} navigation={this.props.navigation}/>





</View>
                




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
