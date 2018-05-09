import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Alert, Image } from "react-native"
import { Avatar } from "react-native-elements"
import { Icon } from "native-base"
import renderIf from "../assets/functions/renderIf"

export default class Person extends Component {
    constructor(props) {
        super(props)
        this.state ={
            currentUser: this.props.currentUser,
            person: this.props.person,
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

    alertAddUser = (person) => {
        Alert.alert(
            person.name,
            'Add as Friend',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => this.postFriend(person)},
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
                    this.state.currentUser.friends.unshift(friend)
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
      const person = this.state.person
    return (
        <View>
            <TouchableOpacity
                style={styles.card}
                key={person._id}
                onPress={() => this.toggleInfo()}
                >
                <Avatar
                    large
                    rounded
                    source={{uri: person.picture.data.url}}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                />
                <Text
                    style={{color: "white", fontSize: 20, marginLeft: 20}}>{person.name}</Text>
                <Icon style={{marginLeft: "auto"}} type="FontAwesome" name="chevron-right" />
            </TouchableOpacity>
            {renderIf(this.state.infoVisible)(
                <View style={styles.userInfo}>
                    <TouchableOpacity
                        onPress={() => this.alertAddUser(person)}
                        style={styles.addFriendButton}>
                        <Text style={{fontSize: 20, fontWeight: 0.62, color: "white"}}>Add Friend</Text>
                        <Icon
                            type="FontAwesome"
                            name="plus"
                            />
                    </TouchableOpacity>
                    {/* <View style={{marginBottom: 6}}>
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
                    </View> */}
                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", borderBottomWidth: 1, marginBottom: 10}}>
                            <Image
                                source={require("../assets/icons/boomerang_cocktail_icon.png")}
                                style={{width: 20, height: 20}}/>
                            <Text style={{fontWeight: 0.62, color: "white", marginLeft: 10}}>Spots</Text>
                        </View>
                        {person.spots.map((spot, i) => {
                            return (
                            <View
                                style={styles.spots}
                                key={i}>
                                <Avatar
                                    small
                                    rounded
                                    source={{uri: spot.picture}}
                                    onPress={() => console.log("Works!")}
                                    activeOpacity={0.7}
                                />
                                <Text
                                    style={{color: "white", marginLeft: 10}}>{spot.name}</Text>
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
    },
    card: {
        flex: 1,
        width: "100%",
        height: 83,
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "black",
        marginTop: 3,
        marginBottom: 3,
        backgroundColor: "#2892D7"
   },
    addFriendButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "green",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20
    },
    spots: {
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#1D70A2",
        marginBottom: 5
    }
})