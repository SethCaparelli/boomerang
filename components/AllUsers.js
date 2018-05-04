import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
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
  render() {
    return (
        <ScrollView>
        <View style={styles.container}>
            {
                this.state.users.map((user, i) => {
                    return (
                        <View
                            style={styles.card}>
                            <Image
                                style={{width: 75, height: 75, borderRadius: "50%"}}
                                source={{uri: user.picture.data.url}}/>
                            <Text>{user.name}</Text>
                        </View>
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