import Expo from "expo"
import React, { Component } from "react"
import { Platform, Text, View, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from "react-native"
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
        <View
          style={styles.container}>
            <View style={styles.logo}>
              <Image
                style={{height: 50, width: 50}}
                source={require("../assets/icons/boomerang_boomerang_icon.png")}/>
            </View>
            <ScrollView
              style={{width: "100%"}}>
            {this.state.currentUser.boomerangReceived
              ? this.state.currentUser.boomerangReceived.map((boomerang, i) => {
                  return(
                        <Boomerang
                          key={i}
                          boomerang={boomerang}
                          currentUser={this.state.currentUser}/>
                  )
              })
            : <Text>Sorry, You have no Boomerangs</Text>
          }
            </ScrollView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#1B4353"
    },
    logo: {
      alignItems: "center"
    }
  })
