import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Avatar } from "react-native-elements"
import { Icon } from "native-base"
import FriendSpot from "./FriendSpot"
import renderIf from "../assets/functions/renderIf"

export default class Friend extends Component {
    constructor(props) {
        super(props)
        this.state = {
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

    updateState = (user) => {
        this.setState({currentUser: user})
    }

    toggleInfo = () => {
        this.setState({infoVisible: !this.state.infoVisible})
    }

    removeFriend = (friend) => {
        const id = this.state.currentUser.fbId
        const newFriends = this.state.currentUser.friends.filter(user => user._id !== friend._id)
        const currentUser = this.state.currentUser
        currentUser.friends = newFriends
        this.setState({
            currentUser
        })
        fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.state.currentUser)
                })
                .then(response => {
                    console.log(response)
                    if(response.status == 200) {
                        Alert.alert(
                            "Success",
                            "Friend Removed",
                            [
                            {text: "OK"},
                            ],
                            {cancelable: false}
                        )
                    } else {
                        Alert.alert(
                            "Sorry",
                            `${friend.name} could not be removed`,
                            [
                            {text: "OK"},
                            ],
                            {cancelable: false}
                        )
                    }
                })
                .then(user => {
                    this.setState({
                        currentUser: user
                    })
                return this.props.toggleModal()
                })
                .catch(error => console.log(error))
    }

    // getFriend = (friend, boomerang) => {
    //     console.log("Friend:", friend)
    //     fetch(`http://localhost:3000/users/${friend.fbId}`)
    //     .then((response) => response.json())
    //     .then(user => this.sendBoomerang(user, boomerang))
    //     .catch(error => console.log(error))
    //   }

    sendBoomerang = (friend, boomerang) => {
        console.log(friend, boomerang)
    }

    render() {
        const friend = this.state.friend
        return (
            <View>
                <TouchableOpacity
                    style={styles.card}
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
                    <Icon style={{marginLeft: "auto"}}type="FontAwesome" name="chevron-right" />
                </TouchableOpacity>
                {renderIf(this.state.infoVisible)(
                <View style={styles.userInfo}>
                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", borderBottomWidth: 1}}>
                            <Icon type="FontAwesome" name="map-marker" />
                            <Text style={{fontWeight: 0.62}}>Spots</Text>
                        </View>
                        {friend.spots.map((spot, i) => {
                            return (
                                <FriendSpot
                                    friend={this.state.friend}
                                    key={i}
                                    spot={spot}
                                    currentUser={this.state.currentUser}/>
                                )
                        })}
                    </View>
                    <View style={{marginBottom: 6}}>
                        <View style={{flexDirection: "row", alignItems: "center", borderBottomWidth: 1, marginBottom: 3}}>
                            <Icon type="Ionicons" name="people"/>
                            <Text style={{fontWeight: 0.62, fontStyle: "underlined"}}>Friends</Text>
                        </View>
                        <View>
                        {friend.friends.map(user => {
                            return(
                                <View key={user._id} style={styles.user}>
                                    <Text key={user._id}>{user.name}</Text>
                                </View>
                            )
                        })}
                        </View>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30}}>
                        <Text>Remove Friend</Text>
                        <TouchableOpacity
                            onPress={() => this.removeFriend(friend)}>
                            <Icon
                                type="FontAwesome"
                                name="minus"
                            />
                        </TouchableOpacity>
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
   userInfo: {
       marginBottom: 30,
       flex: 1
   }
})