import React, { Component } from 'react'
import { ScrollView, Text, View, Alert, TouchableOpacity, StyleSheet, Button } from "react-native"
import Friend from "./Friend"
import { Icon } from "native-base"
import AllSpots from "./AllSpots"
import UsersSpot from "./UsersSpot"
import Swiper from 'react-native-swiper'
export default class UsersSpots extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: this.props.currentUser,
            modalVisible: false
        }
    }

    static navigationOptions = {
        title: "Your Spots"
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
        // this.setState({currentUser: user})
    }

    toggleModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: "center",
                width: "100%",
                backgroundColor: "#1D70A2",
                borderRadius: 10,
                borderWidth: 1}}>
                <Swiper
                    autoplay={true}
                    showsPagination={false}
                    style={{flex: 0}}>
                {
                this.state.currentUser.spots.map((spot, i) => {
                    return (
                        <UsersSpot
                            currentUser={this.state.currentUser}
                            spot={spot}
                            key={i}
                        />
                    )
                })}
                </Swiper>
            </View>
        )
    }
}
