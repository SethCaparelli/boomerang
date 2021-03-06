import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native"
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
        const user = {
            name: this.state.currentUser.name,
            picture: this.state.currentUser.picture.data.url,
            spots: this.state.currentUser.spots
        }
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
            this.props.toggleModal()
            if(response.status == 200) {
                Alert.alert(
                    "Success",
                    `Boomerang sent to ${friend.name}`
                )
            } else {
                Alert.alert(
                    "Sorry",
                    "Unable to send Boomerang"
                )
            }
        })
        .then(user => {
            this.setState({currentUser: user})
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
                    <Text style={{color: "white", marginLeft: 10}}>{this.props.spot.name}</Text>
                    <Icon style={{marginLeft: "auto"}} type="FontAwesome" name="chevron-right" />
                </TouchableOpacity>
                {renderIf(this.state.infoVisible)(
                    <View style={{flex: 1, marginBottom: 30, borderBottomWidth: 1}}>
                        <View
                            style={styles.address}>
                            <Icon
                                style={{color: "#6DAEDB"}}
                                type="FontAwesome"
                                name="map-marker"/>
                            <Text style={{color: "white", marginLeft: 5}}>{this.props.spot.address}</Text>
                        </View>
                        <View>
                            <View
                                style={{flexDirection: "row", marginBottom: 8}}>
                                <Image
                                    style={{height: 25, width: 25}}
                                    source={require("../assets/icons/boomerang_boomerang_icon.png")}/>
                                <Text
                                    style={{color: "white", fontSize: 18}}>Boomerangs</Text>
                            </View>
                        {
                            this.props.spot.drinks.map((drink, i) => {
                                return (
                                <TouchableOpacity
                                    style={styles.drink}
                                    onPress={() => this.getFriend(drink)}>
                                    <View style={{flexDirection: "row", alignItems: "center", flex: 0.3, justifyContent: "space-between"}}>
                                        <Text style={{color: "white"}}>{drink.type.charAt(0).toUpperCase() + drink.type.slice(1)}</Text>
                                        <Text style={{color: "white"}}>{drink.price.charAt(0).toUpperCase() + drink.price.slice(1)}</Text>
                                    </View>
                                    <Image
                                        style={{height: 20, width: 20}}
                                        source={require("../assets/icons/boomerang_boomerang_icon.png")}/>
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
        alignItems: "center",
        backgroundColor: "#1D70A2",
        borderWidth: 1,
        borderRadius: 5
    },
    drink: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#173753",
        borderWidth: 1,
        borderRadius: 5
    },
    address: {
        flexDirection: "row",
        marginBottom: 6,
        alignItems: "center",
        borderBottomWidth: 1
    }
})
