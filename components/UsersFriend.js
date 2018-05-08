import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Avatar } from "react-native-elements"
import { Icon } from "native-base"
import renderIf from "../assets/functions/renderIf"

export default class UserFriend extends Component {
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

    toggleInfo = () => {
        this.setState({infoVisible: !this.state.infoVisible})
    }

    removeFriend = (friend) => {
        console.log(friend)
        console.log(this.state.currentUser.friends)
        let friendIndex = this.state.currentUser.friends.indexOf(friend._id)
        console.log(friendIndex)
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
                    <View style={{flexDirection: "row", justifyContent: "space-between",  alignItems: "center"}}>
                        <Text style={{fontSize: 20, fontWeight: 0.62}}>Send Boomerang</Text>
                        <Icon
                            type="FontAwesome"
                            name="plus"
                            onPress={() => this.alertAddUser(friend)}/>
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
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
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
})