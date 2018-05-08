import Expo from "expo"
import React, { Component } from "react"
import { Platform, Text, View, StyleSheet, Image, TouchableOpacity, Alert, Button } from "react-native"
import { Avatar } from "react-native-elements"
import QRCode from 'react-native-qrcode'
import renderIf from "../assets/functions/renderIf"
import Modal from "react-native-modal"

export default class Boomerang extends Component {
  constructor(props) {
    super(props)
    this.state = {
          currentUser: this.props.currentUser,
          boomerang: this.props.boomerang,
          showQR: false
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

    toggleQR = () => {
        this.setState({
            showQR: !this.state.showQR
        })
    }


  render() {
      console.log(this.state.boomerang)
    return (
        <View>
            <TouchableOpacity
                onPress={() => this.toggleQR()}>
                <Text>{this.state.boomerang.user.name}</Text>
            </TouchableOpacity>
            <Modal
                style={styles.modal}
                isVisible={this.state.showQR}>
                <View>
                    <Text>{this.state.boomerang.user.name}</Text>
                </View>
                <QRCode
                    value={this.state.boomerang.drink.price}
                    size={350}
                    bgColor='black'
                    fgColor='white'/>
                <Button
                    onPress={() => this.toggleQR()}
                    title="Close"/>
            </Modal>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        alignItems: "center"
    }
})

