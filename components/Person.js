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
                            fetch("http://localhost:3000/users")
                                .then(response => response.json())
                                .then(users => {
                                    this.setState({users})
                                })
                                .catch(error => console.log(error))
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
                    large
                    rounded
                    source={{uri: friend.picture.data.url}}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                />
                <Text>{friend.name}</Text>
                <Icon style={{marginLeft: "auto"}} type="FontAwesome" name="chevron-right" />
            </TouchableOpacity>
            {renderIf(this.state.infoVisible)(
                <View style={styles.userInfo}>
                    <TouchableOpacity
                        onPress={() => this.alertAddUser(friend)}
                        style={{flexDirection: "row", justifyContent: "space-between",  alignItems: "center"}}>
                        <Text style={{fontSize: 20, fontWeight: 0.62}}>Add Friend</Text>
                        <Icon
                            type="FontAwesome"
                            name="plus"
                            />
                    </TouchableOpacity>
                    <View style={{marginBottom: 6}}>
                        <View style={{flexDirection: "row", alignItems: "center", borderBottomWidth: 1, marginBottom: 3}}>
                            <Icon type="Ionicons" name="people"/>
                            <Text style={{fontWeight: 0.62, fontStyle: "underlined"}}>Friends</Text>
                        </View>
                        <View>
                        {friend.friends.map((user, i) => {
                        return(
                            <View key={i} style={styles.user}>
                                <Text key={i}>{user.name}</Text>
                            </View>
                        )
                        })}
                        </View>
                    </View>
                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", borderBottomWidth: 1}}>
                            <Icon type="FontAwesome" name="map-marker" />
                            <Text style={{fontWeight: 0.62}}>Spots</Text>
                        </View>
                        {friend.spots.map((spot, i) => {
                            <View key={i}>
                                <Text>{spot.name}</Text>
                            </View>
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
        height: 100,
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "black",
        marginTop: 3,
        marginBottom: 3,
        backgroundColor: "white"
   },
})