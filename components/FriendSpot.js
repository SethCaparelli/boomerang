import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Avatar } from "react-native-elements"
import renderIf from "../assets/functions/renderIf"
import { Icon } from "native-base"

export default class FriendSpot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: this.props.currentUser,
            infoVisble: false
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

    addSpot = (spot) => {
        console.log(spot)
        const id = this.state.currentUser.fbId
        const sameSpots = this.state.currentUser.spots.filter(place => {
            return place.name == spot.name
        })
        console.log(sameSpots)
        if(sameSpots.length > 0) {
            Alert.alert(
                `${spot.name} is already your spot`,
                "",
                [
                {text: "OK"},
                ],
                {cancelable: false}
            )
        } else {
            this.state.currentUser.spots.push(spot)
            fetch(`http://localhost:3000/users/${id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.state.currentUser)
                })
                .then(response => {
                    if(response.status == 200) {
                        Alert.alert(
                            "Success",
                            `${this.props.spot.name} is now your spot`,
                            [
                            {text: "OK"},
                            ],
                            {cancelable: false}
                        )
                        this.setState({
                            currentUser: user
                        })
                    } else {
                        Alert.alert(
                            "Sorry",
                            `${this.props.spot.name} could not be added`,
                            [
                            {text: "OK"},
                            ],
                            {cancelable: false}
                        )
                    }
                })
                .then(user => {
                    this.setState({
                        currentUser: user
                    })
                })
                .catch(error => console.log(error))
        }
    }

    getFriend = (drink, spot) => {
        const id = this.props.friend.fbId
        fetch(`http://localhost:3000/users/${id}`)
            .then(response => response.json())
            .then(friend => this.addBoomerang(friend, drink))
            .catch(error => console.log(error))
    }

    addBoomerang = (friend, drink) => {
        const user = this.state.currentUser
        const spot = this.props.spot
        const boomerang = {
            drink,
            spot,
            user
        }
        friend.boomerangReceived.push(boomerang)
        this.sendBoomerang(friend)
        return this.boomerangSent(boomerang, friend)
    }

    boomerangSent = (boomerang, friend) => {
        console.log(boomerang, friend)
    }

    sendBoomerang = (friend) => {
        console.log(friend)
        const id = friend.fbId
        fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(friend)
        })
        .then(response => {
            if(response.status == 200) {
                Alert.alert(
                    "Success",
                    `Boomerang sent to ${friend.name}`
                )
            }
        })
        .catch(error => console.log(error))
    }

    render() {
        return (
           <View>
                <TouchableOpacity
                    style={styles.locationHeader}
                    onPress={() => this.toggleInfo()}>
                    <Avatar
                        medium
                        rounded
                        source={{uri: this.props.spot.picture}}
                        activeOpacity={0.7}
                    />
                    <Text>{this.props.spot.name}</Text>
                    <Icon style={{marginLeft: "auto"}} type="FontAwesome" name="chevron-right" />
                </TouchableOpacity>
                {renderIf(this.state.infoVisible)(
                    <View style={{flex: 1, marginBottom: 30}}>
                        <View>
                            <View>
                                <Text>{this.props.spot.address}</Text>
                            </View>
                        </View>
                        <View>
                            <Text>Boomerangs</Text>
                        {
                            this.props.spot.drinks.map((drink, i) => {
                                return (
                                <TouchableOpacity
                                    style={styles.drink}
                                    onPress={() => this.getFriend(drink)}>
                                    <View style={{flexDirection: "row", alignItems: "center", flex: 0.3, justifyContent: "space-between"}}>
                                        <Text>{drink.type}</Text>
                                        <Text>{drink.price}</Text>
                                    </View>
                                    <Icon
                                        type="FontAwesome"
                                        name="plus"/>
                                </TouchableOpacity>
                                )
                            })
                        }
                        </View>
                    </View>
                )}
           </View>
        )
    }
}

const styles = StyleSheet.create({
    locationHeader: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    drink: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})
