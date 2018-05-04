import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from "react-native"
import { ListItem, Avatar } from 'react-native-elements'

export default class AllUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    static navigationOptions = {
        title: 'Boomerangers'
      }

    componentDidMount() {
        console.log(this.state.users)
        fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(users => {
            this.setState({users})
        })
    }

    alertAddUser = (user) => {
        console.log(user.name)
        Alert.alert(
            user.name,
            'Add as Friend',
            [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: (user) => console.log("user " + user)},
            ],
            {cancelable: true}
            )
    }

  render() {
    return (
        <ScrollView>
        <View style={styles.container}>
            {
                this.state.users.map((user) => {
                    return (
                        <TouchableOpacity
                            key={user._id}
                            onPress={(user) => this.alertAddUser(user)}
                            style={styles.card}>
                            <Image
                                style={{width: 75, height: 75, borderRadius: "40%"}}
                                source={{uri: user.picture.data.url}}/>
                            <Text>{user.name}</Text>
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
        borderColor: 'black',
        marginTop: 1,
        marginBottom: 1,
        backgroundColor: "white"
   }
})