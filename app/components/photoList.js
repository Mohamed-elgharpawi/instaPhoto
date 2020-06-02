import React from 'react'

import { TouchableOpacity, StyleSheet, Text, View, FlatList, BackHandler, Alert } from 'react-native';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { f, auth, database, storage } from '../../config/config'
import Ionicons from 'react-native-vector-icons/Ionicons';



export default class PhotoList extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            photo_feed:[],

            refresh: false,
            loading: true,
            empty:false,
            userId:'',
            type:''


        }
    }
    componentDidMount = () => {

        const { isUser, userId,type } = this.props;
        this.state.userId=userId
        this.state.type=type
        if (isUser == true) {

            this.loadFeed(this.state.userId)
            

        }
        else {
            this.loadFeed('')

        }

        



    }


    sCheck = (s) => {

        if (s == 1) {

            return 'ago';
        }
        else {

            return 's ago'

        }

    }
    timeConverter = (timestamp) => {
        var a = new Date(timestamp * 1000)
        var seconds = Math.floor((new Date() - a) / 1000);
        console.log(seconds)
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' year' + this.sCheck(interval);
        }
        interval = Math.floor(seconds / 2592000);

        if (interval > 1) {
            return interval + ' month' + this.sCheck(interval);
        }

        interval = Math.floor(seconds / 86400);

        if (interval > 1) {
            return interval + ' day' + this.sCheck(interval);
        }

        interval = Math.floor(seconds / 3600);

        if (interval > 1) {
            return interval + ' hour' + this.sCheck(interval);
        }
        interval = Math.floor(seconds / 60);

        if (interval > 1) {
            return interval + ' minute' + this.sCheck(interval);
        }

        return interval + ' second' + this.sCheck(seconds);


    }

    addToFlatList = (photo_feed, data, photo) => {
        var that = this;


        //photo='"'+photo+'"';
        console.log("OBJTEST" + photo)


        var photoObj = data[photo];


        database.ref('users').child(photoObj.author).child('username').once('value')
            .then(function (snapshot) {
                const exists = (snapshot.val() != null);
                if (exists) data = snapshot.val();
                photo_feed.push({
                    id: photo,
                    url: photoObj.url,
                    caption: photoObj.caption,
                    posted: that.timeConverter(photoObj.posted),
                   timestamp:photoObj.posted,
                    author: data,
                    authorId: photoObj.author

                });

                var orderedData=[].concat(photo_feed).sort((a,b)=>a.timestamp<b.timestamp);

                that.setState({

                    refresh: false,
                    loading: false,
                    photo_feed:orderedData


                })


            }).catch(err => console.log(err));





    }





    loadFeed = () => {
        const { userId,type } = this.props;
        this.state.type=type
        this.state.userId=userId

        this.setState({
            refresh: true,
            photo_feed:[]



        });
        var that = this;

         var loadRef = database.ref('photos');
        if (this.state.type === 'mypro') {
            this.state.refresh=true


            loadRef = database.ref('users').child(f.auth().currentUser.uid).child('photos')
       }
       if (this.state.type === 'anthorPro') {
          
        this.state.refresh=true
        loadRef = database.ref('users').child(userId).child('photos')
        

   }

        loadRef.orderByChild('posted').once('value')
            .then(function (snapshot) {
                const exists = (snapshot.val() != null);
                //var data=Array()
                if (exists){
                     data = snapshot.val();

                var photo_feed = that.state.photo_feed;
                that.setState({empty:false});


                for (var photo in data) {

                    that.addToFlatList(photo_feed, data, photo);
                }
            }else{

                that.setState({empty:true});
            }





            });

    }


    loadNew = () => {
        this.loadFeed();


    }



    render() {

        return (

            <View style={styles.container}>

                {this.state.loading == true ? (

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      
                      {this.state.empty==true?(
                 <Text>No Photos to display..</Text>
  

                      ):(
                        <Text>Loading..</Text>
                        )}
                    </View>
                ) : (

                        <FlatList
                            refreshing={this.state.refresh}
                            onRefresh={this.loadNew}
                            data={this.state.photo_feed}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flex: 1, backgroundColor: '#eee' }}

                            renderItem={({ item, index }) => (
                                <View key={index} style={{ width: '100%', overflow: 'hidden', borderBottomWidth: 1, marginBottom: 5, borderColor: 'grey', justifyContent: 'space-between' }}>
                                    <View style={{ padding: 10, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('userProfile', { userId: item.authorId })

                                            }}
                                        >
                                            <Text style={{fontWeight:'bold',color:'blue'}}>{item.author}</Text>
                                        </TouchableOpacity>

                                        <Text>{item.posted}</Text>


                                    </View>

                                    <Image source={{ uri: item.url }}

                                        indicator={Progress.pie}
                                        indicatorProps={{
                                            size: 80,
                                            borderWidth: 0,
                                            color: 'rgba(150, 150, 150, 1)',
                                            unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                        }}
                                        style={{ resizeMode: 'cover', width: '100%', height: 275 }}
                                    />



                                    <View style={{ padding: 5 }}>
                                        <Text>{item.caption}</Text>
                                        <TouchableOpacity style={{backgroundColor:"lightblue"}} onPress={() => this.props.navigation.push('comments', {photoId:item.id})}>

                                        <View style={{backgroundColor:"lightblue",width:'100%',justifyContent: 'space-evenly',flexDirection:"row"}}>
                                        <Ionicons name="ios-menu" size={30} color={"blue"}/>
                                            <Text style={{  textAlign: 'center' ,marginTop:5}}>View Comments</Text>
                               

                                        </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>




                            )}
                        />
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
