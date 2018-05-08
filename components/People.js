import React, { Component } from "react"
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from "react-native"
import { ListItem, Avatar, SearchBar } from "react-native-elements"
import Person from "./Person"

export default class People extends Component {
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
        const id = this.state.currentUser.fbId
        fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(users => {
                this.setState({users})
                fetch(`http://localhost:3000/users/${id}`)
                    .then(response => response.json())
                    .then(user => {
                        this.setState({currentUser: user})
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    }

    searchUsers = (term) => {
        console.log(term)
        let searchedUsers = this.state.users.filter(user => {
            return user.name == String(term)
        })
        console.log(searchedUsers)
        this.setState({
            users: searchedUsers
        })
    }

  render() {
    return (
        <View style={styles.container}>
            <SearchBar
                onChangeText={(term) => this.searchUsers(term)}
                // onClear={someMethod}
                placeholder='Type Here...' />
            <ScrollView>
            {
                this.state.users.map((user) => {
                    return (
                        <Person
                            key={user._id}
                            friend={user}
                            currentUser={this.state.currentUser}/>
                    )
                })
            }
            </ScrollView>
        </View>
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
})