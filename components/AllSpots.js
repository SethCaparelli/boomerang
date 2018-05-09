import React, { Component } from 'react'
import { View, Text, ScrollView } from "react-native"
import Spot from "./Spot"
import { SearchBar } from "react-native-elements"
import Swiper from 'react-native-swiper'

export default class AllSpots extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: this.props.navigation.state.params.currentUser,
            spots: []
        }
    }

    componentDidMount() {
        const id = this.state.currentUser.fbId
        fetch("http://localhost:3000/spots")
            .then(response => response.json())
            .then(spots => {
                this.setState({spots})
                return fetch(`http://localhost:3000/users/${id}`)
                    .then(response => response.json())
                    .then(user => {
                        this.setState({currentUser: user})
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <View
                style={{flex: 1, backgroundColor: "#1B4353"}}>
                 <SearchBar
                    onChangeText={(term) => this.searchUsers(term)}
                    // onClear={someMethod}
                    placeholder='Type Here...' />
                <ScrollView
                    style={{flex: 1}}>
                {this.state.spots.map((spot, i) => {
                    return (
                        <Spot
                            updateState={this.props.updateState}
                            toggleModal={this.props.toggleModal}
                            key={i}
                            currentUser={this.state.currentUser}
                            spot={spot}
                        />
                    )
                })
                }
                </ScrollView>
            </View>
        )
    }
}
