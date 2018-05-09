import React, { Component } from 'react'
import { ScrollView, Text, View, Alert } from "react-native"
import Friend from "./Friend"
import { Icon } from "native-base"

export default class Friends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: this.props.currentUser,
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

    updateState = (user) => {
        console.log("updateState: ", user)
        this.setState({currentUser: user})
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    componentWillUnmount() {
        Alert.alert('COMPONENT WILL UNMOUNT')
      }


    render() {
        return (
            <View
                style={{flex: 1, width: "100%"}}>
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
