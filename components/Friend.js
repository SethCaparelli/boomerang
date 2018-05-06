import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native"
import { Avatar } from "react-native-elements"
import { Icon } from "native-base"
import renderIf from "../assets/functions/renderIf"

export default class Friend extends Component {
    constructor(props) {
        super(props)
        this.state ={
            currentUser: this.props.currentUser,
            friend: this.props.friend,
            infoVisible: false
        }
    }

    componentDidMount() {
        const id = this.state.currentUser.fbId
        fetch(`http://localhost:3000/users/${id}`)
            .then(response => response.json())
            .then(user => {
                this.setState({currentUser: user})
            })
            .catch(error => console.log(error))
    }

    alertAddUser = (user) => {
        Alert.alert(
            user.name,
            'Add as Friend',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => this.postFriend(user)},
            ],
            { cancelable: true }
          )
    }

    postFriend = (user) => {
        const friend = user
        const id = this.state.currentUser.fbId
        fetch(`http://localhost:3000/users/${id}`)
        .then(response => response.json())
        .then(currentUser => {
            const sameFriend = currentUser.friends.filter(friend => {
                return friend._id == user._id
            })
            // console.log("postUser:", user)
            console.log("sameFriend:", sameFriend)
            if(sameFriend.length > 0) {
                Alert.alert(
                    `${user.name} is already your friend`,
                    "",
                    [
                    {text: "Cancel", style: "cancel"},
                    {text: "OK"},
                    ],
                    {cancelable: true}
                    )
            } else {
                this.state.currentUser.friends.push(friend)
                console.log(this.state.currentUser)
                fetch(`http://localhost:3000/users/${id}`, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.state.currentUser)
                    })
                .then(response => response.json())
                .then(user => {
                    this.setState({
                        currentUser: user
                    })
                    Alert.alert(
                        "Success",
                        `${friend.name} is now your friend`,
                        [
                        {text: "OK"},
                        ],
                        {cancelable: false}
                    )
                })
                .catch(error => console.log())
            }
        })
        .catch(error => console.log(error))
    }

    toggleInfo = () => {
        this.setState({infoVisible: !this.state.infoVisible})
    }

  render() {
      const friend = this.state.friend
    return (
        <View>
            <TouchableOpacity
                style={styles.card}
                key={friend._id}
                onPress={() => this.toggleInfo()}
                >
                <Avatar
                    medium
                    rounded
                    source={{uri: friend.picture.data.url}}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                />
                <Text>{friend.name}</Text>
                <Icon type="FontAwesome" name="chevron-right" />
            </TouchableOpacity>
            {renderIf(this.state.infoVisible)(
                <View style={styles.userInfo}>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Add Friend</Text>
                        <Icon
                            type="FontAwesome"
                            name="plus"
                            onPress={() => this.alertAddUser(friend)}/>
                    </View>
                    <View>
                        <Text>Friends</Text>
                        {friend.friends.map((user) => {
                        return(
                            <View style={styles.user}>
                                <Text>{user.name}</Text>
                            </View>
                        )
                        })}
                    </View>
                </View>)}
        </View>

    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "black"
    },
    card: {
        flex: 1,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: "black",
        marginTop: 1,
        marginBottom: 1,
        backgroundColor: "white"
   },
//    userInfo: {
//        display: this.state.infoVisible
//    }
})