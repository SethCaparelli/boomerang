import Expo from "expo"
import React, { Component } from "react"
import { Platform, Text, View, StyleSheet, Image, TouchableOpacity, Alert, Button } from "react-native"
import { Avatar } from "react-native-elements"
import QRCode from 'react-native-qrcode'
import renderIf from "../assets/functions/renderIf"
import Modal from "react-native-modal"
import { Icon } from "native-base"

export default class Boomerang extends Component {
  constructor(props) {
    super(props)
    this.state = {
          currentUser: this.props.currentUser,
          boomerang: this.props.boomerang,
          showQR: false,
          showBoomerangInfo: false
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

    toggleInfo = () => {
        this.setState({
            showBoomerangInfo: !this.state.showBoomerangInfo
        })
    }

  render() {
      console.log(this.state.boomerang)
    return (
        <View>
            <TouchableOpacity
                style={styles.boomerangHeader}
                onPress={() => this.toggleInfo()}>
                <Image
                    style={{width: 30, height: 30, margin: 3}}
                    source={require("../assets/icons/boomerang_boomerang_icon.png")}/>
                <Text style={{color: "white", fontSize: 20, marginLeft: 10}}>BOOMERANG</Text>
                {/* <Text>{this.state.boomerang.user.name}</Text> */}
            </TouchableOpacity>
            {renderIf(this.state.showBoomerangInfo)(
            <View>
                <Text style={{color: "white"}}>From:</Text>
                <View
                    style={styles.user}>
                    <Avatar
                        small
                        rounded
                        source={{uri: this.state.boomerang.user.picture}}
                        activeOpacity={0.7}
                    />
                    <Text
                        style={{color: "white", marginLeft: 5}}>{this.state.boomerang.user.name}</Text>
                </View>
                <Text style={{color: "white"}}>Spot:</Text>
                <View
                    style={styles.spot}>
                    <Avatar
                        small
                        rounded
                        source={{uri: this.state.boomerang.spot.picture}}
                        activeOpacity={0.7}
                    />
                    <Text
                        style={{color: "white", marginLeft: 5}}>{this.state.boomerang.spot.name}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => this.toggleQR()}
                    style={styles.redeem}>
                    <Text style={{fontSize: 20, fontWeight: 0.62, color: "white"}}>Redeem</Text>
                    <Icon
                        type="FontAwesome"
                        name="plus"
                        />
                </TouchableOpacity>
            </View>
            )}
            <Modal
                style={styles.modal}
                isVisible={this.state.showQR}>
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
    },
    boomerangHeader: {
        marginTop: 20,
        backgroundColor: "#173753",
        width: "100%",
        height: 100,
        borderRadius: 5,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    user: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2892D7",
        borderWidth: 1,
        borderRadius: 5
    },
    redeem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "green",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 20
    },
    user: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1D70A2",
        borderWidth: 1,
        borderRadius: 5
    },
    spot: {
        flexDirection: "row",
        alignItems: "center"
    }
})

