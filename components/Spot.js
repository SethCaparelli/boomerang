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
                    <TouchableOpacity
                        onPress={() => this.addSpot(this.props.spot)}>
                        <Text>Add Spot</Text>
                        <Icon
                            type="FontAwesome"
                            name="plus"/>
                    </TouchableOpacity>
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
    }
})
