import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Text, TextInput, KeyboardAvoidingView,View, Image, FlatList, TouchableOpacity } from 'react-native';
import { f, storage, auth, database } from '../../config/config.js'


export default class comments extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

            loggedin: false,
            comments_list: [],
            comment: ''
        }
    }
    addCommentToList(comments_list, data, comment) {

        // console.log(comments_list,data,comment)
        var that = this;
        var commentObj = data[comment];
        database.ref('users').child(commentObj.author).child('username').once('value').then(function (snapshot) {
            const exists = (snapshot.val() != null);
            if (exists) data = snapshot.val();

            comments_list.push({
                id: comment,
                comment: commentObj.comment,
                posted: that.timeConverter(commentObj.posted),
                author: data,
                authorId: commentObj.author


            });

            that.setState({
                refresh: false,
                loading: false

            });



        }).catch(err => console.log(err));



    }

    checkParams = () => {
        var params = this.props.route.params



        if (params) {

            if (params.photoId) {

                this.setState({

                    photoId: params.photoId

                });
                this.fetchComments(params.photoId);
            }
        }
    }



    fetchComments = (photoId) => {
        var that = this;
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then(function (snapshot) {

            const exists = (snapshot.val() != null);

            if (exists) {

                data = snapshot.val();
                var comments_list = that.state.comments_list;

                for (comment in data) {
                    that.addCommentToList(comments_list, data, comment)

                }



            }
            else {
                that.setState({
                    comments_list: []


                });



            }



        }).catch(errror => console.log(errror));


    }



    randomStr = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    uniqueId = () => {
        return this.randomStr() + this.randomStr() + '-' + this.randomStr() + '-' +
            this.randomStr() + '-' + this.randomStr() + '-'
            + this.randomStr() + '-' + this.randomStr() + '-' + this.randomStr();


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




    componentDidMount = () => {
       
        this.checkParams();



    }
   
   

    postComment = () => {


        var comment = this.state.comment;

        if (comment != '') {
            var imageId = this.state.photoId;
            var userId = f.auth().currentUser.uid;
            var commentId = this.uniqueId();
            var dateTime = Date.now();
            var timestamp = Math.floor(dateTime / 1000);
            this.setState({
                comment: ''

            });
            Keyboard.dismiss()
            this.state.comment = '';

            var commentObj = {
                posted: timestamp,
                author: userId,
                comment: comment


            };

            database.ref('/comments/' + imageId + '/' + commentId).set(commentObj);


            //reload comments

            this.reloadCommentList();




        } else {

            alert('please Enter the comment')
        }



    }

    reloadCommentList = () => {
        this.setState({

            comments_list: [],
            comment: ''


        });

        this.fetchComments(this.state.photoId);


    }
    



    render() {

        return (


            <View style={styles.container}>
                {this.state.comments_list.length == 0 ? (

                    //no comments
                    <View><Text>No comments Founded..</Text></View>


                ) : (
                        <FlatList

                            refreshing={this.state.refresh}
                            data={this.state.comments_list}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flex: 1, backgroundColor: '#eee' }}
                            renderItem={({ item, index }) => (
                                <View key={index} style={{ width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>

                                    <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('userProfile', { userId: item.authorId })}
                                        >
                                            <Text style={{fontWeight:'bold',color:'blue'}}>
                                                {item.author}

                                            </Text>

                                        </TouchableOpacity>
                                        <Text>{item.posted}</Text>


                                    </View>

                                    <View style={{ padding: 5 }}>
                                        <Text>{item.comment}</Text>

                                    </View>

                                </View>

                            )}


                        />



                    )}

                <KeyboardAvoidingView
                    behavior="height"
                    enabled

                    style={{ borderTopColor: 'grey', borderTopWidth: 1, padding: 10, marginBottom: 15 }}
                >

                    <Text style={{ fontWeight: 'bold' }}>Post Comment</Text>

                    <View>
                        <TextInput

                            editable={true}
                            placeholder={'enter your comment here..'}
                            onChangeText={(text) => this.setState({ comment: text })}
                            value={this.state.comment}
                            style={{ textAlignVertical: 'top', marginVertical: 10, height: 50, padding: 5, borderColor: 'grey', borderRadius: 3, backgroundColor: 'white', color: 'black' }}
                        />

                        <TouchableOpacity

                            style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', borderRadius: 5 }}
                            onPress={() => this.postComment()}
                        >
                            <Text style={{ color: 'white' }}>Post</Text>


                        </TouchableOpacity>


                    </View>


                </KeyboardAvoidingView>






            </View>

        );


    }



}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
});
