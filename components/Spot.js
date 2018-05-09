import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Avatar } from "react-native-elements"
import renderIf from "../assets/functions/renderIf"
import { Icon } from "native-base"

export default class Spot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: this.props.currentUser,
            infoVisible: false
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
        const id = this.state.currentUser.fbId
        const sameSpots = this.state.currentUser.spots.filter(place => {
            return place.name == spot.name
        })
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
                    return this.props.toggleModal
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
                    return this.props.toggleModal
                })
                .then(user => {
                    this.setState({
                        currentUser: user
                    })
                return this.props.updateState(user)
                })
                .catch(error => console.log(error))
        }
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
                    <View>
                        <TouchableOpacity
                            style={styles.addSpot}
                            onPress={() => this.addSpot(this.props.spot)}>
                            <Text
                                style={{color: "white"}}>Add Spot</Text>
                            <Icon
                                type="FontAwesome"
                                name="plus"/>
                        </TouchableOpacity>
                        <View
                            style={styles.address}>
                            <Icon
                                style={{color: "#6DAEDB"}}
                                type="FontAwesome"
                                name="map-marker"/>
                            <Text style={{color: "white", marginLeft: 5}}>{this.props.spot.address}</Text>
                        </View>
                    </View>
                )}
           </View>
        )
    }
}

const styles = StyleSheet.create({
    locationHeader: {
        height: 100,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#1D70A2",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5
    },
    addSpot: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        backgroundColor: "green",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5
    },
    address: {
        flexDirection: "row",
        marginBottom: 6,
        alignItems: "center",
        borderBottomWidth: 1
    }
})
