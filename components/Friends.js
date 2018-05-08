import React, { Component } from 'react'
import { ScrollView, Text, View } from "react-native"
import Friend from "./Friend"
import { Icon } from "native-base"

export default class Friends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: this.props.navigation.state.params.currentUser,
        }
    }

    static navigationOptions = {
        title: "Your Friends"
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

    render() {
        return (
            <View>
                <View
                    style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon
                        onPress={() => this.props.navigation.navigate("AllUsers", {currentUser: this.state.currentUser})}
                        type="FontAwesome"
                        name="search" />
                    <Text>Find More Friends</Text>
                </View>
                <ScrollView>
                {
                this.state.currentUser.friends.map((friend, i) => {
                    return (
                        <Friend
                            currentUser={this.state.currentUser}
                            friend={friend}
                            key={i}
                            />
                    )
                })}
                </ScrollView>
            </View>
        )
    }
}
