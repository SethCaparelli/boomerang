import React, { Component } from "react"
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from "react-native"
import { ListItem, Avatar } from "react-native-elements"
import Friend from "./Friend"

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
        fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(users => {
                this.setState({users})
            })
            .catch(error => console.log(error))
    }

  render() {
    return (
        <ScrollView>
            <View style={styles.container}>
                {
                    this.state.users.map((user) => {
                        return (
                            <Friend
                                friend={user}
                                currentUser={this.state.currentUser}/>
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
        backgroundColor: "white"
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