import React, { Component } from "react"
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from "react-native"
import { ListItem, Avatar } from "react-native-elements"

export default class AllUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            currentUser: this.props.navigation.state.params.currentUser
        }
    }

    static navigationOptions = {
        title: "Boomerangers"
      }

    componentDidMount() {
        console.log(this.state.users)
        fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(users => {
            this.setState({users})
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
        console.log("postuser:", user)
        const id = this.state.currentUser.fbId
        console.log(id)
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
                // console.log(id)
                this.state.currentUser.friends.push(friend)
                console.log(this.state.currentUser)
                // debugger
                fetch(`http://localhost:3000/users/${id}`, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.state.currentUser)
                    })
                .then(response => console.log(response))
                .catch(error => console.log())
            }
        })
        .catch(error => console.log(error))
    }
debugger
  render() {
    return (
        <ScrollView>
        <View style={styles.container}>
            {
                this.state.users.map((user) => {
                    return (
                        <TouchableOpacity
                            key={user._id}
                            onPress={() => this.alertAddUser(user)}
                            style={styles.card}>
                            <Image
                                style={{width: 75, height: 75, borderRadius: "40%"}}
                                source={{uri: user.picture.data.url}}/>
                            <Text style={{width: "100%", textAlign: "center"}}>{user.name}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "black"
    },
    card: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: "black",
        marginTop: 1,
        marginBottom: 1,
        backgroundColor: "white"
   }
})