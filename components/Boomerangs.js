import Expo from "expo"
import React, { Component } from "react"
import { Platform, Text, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native"
import { Avatar, Button } from "react-native-elements"
import Boomerang from "./Boomerang"

export default class Boomerangs extends Component {
  constructor(props) {
    super(props)
    this.state = {
          currentUser: this.props.navigation.state.params.currentUser,
      }
    }

    static navigationOptions = {
        title: "Boomerangs"
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
            <View style={styles.avatarContainer}>
            <Avatar
                large
                rounded
                source={{uri: this.state.currentUser.picture.data.url}}
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
              />
            <Text style={{color: "white", fontSize: 20, backgroundColor: "#173753", borderRadius: 30, width: 150, textAlign: "center"}}>Boomerangs</Text>
          </View>
          {this.state.currentUser.boomerangReceived
            ?   this.state.currentUser.boomerangReceived.map((boomerang, i) => {
                  return(
                      <Boomerang
                        key={i}
                        boomerang={boomerang}
                        currentUser={this.state.currentUser}/>
                  )
              })
            : <Text>Sorry, You have no Boomerangs</Text>
          }
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between"
    },
    buttonContainer: {
      flex: 0.12,
      backgroundColor: "#1B4353",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center"
    },
    avatarContainer: {
      flex: 0.2,
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    map: {
      zIndex: 0,
      flex: 1,
      width: "100%",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    icon: {
      width: 35,
      height: 35,
    }
  })
