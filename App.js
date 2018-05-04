import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from "react-native"
import { StackNavigator } from "react-navigation"
import User from "./components/User"
import AllUsers from "./components/AllUsers"
import { SocialIcon, Avatar } from "react-native-elements"


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {
        fbId: 211473406297130,
        name: "Seth Caparelli",
        boomerangSent: [],
        email: "",
        fbId: 211473406297130,
        isDeleted: false,
        name: "Seth Caparelli",
        spots: [],
        friends: [],
        _id: "5ae93947d849586629b225c3"
      },
      userPicture: {
        data: {
          url: "https://lookaside.facebook.com/platform/profilepic/?asid=211473406297130&height=200&width=200&ext=1525620472&hash=AeToBJ1YPcYdW7Qg"          
        }
      }
    }
  }

  static navigationOptions = {
    title: "Home"
  }

  _login = () => {
    Expo.Facebook.logInWithReadPermissionsAsync("593366027693002", {
      permissions: ["public_profile"]
    })
    .then(response => {
      const { token, type } = response
      if(type === "success") {
        fetch(`https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=${token}&fields=id,name,picture.type(large)`)
        .then((response) => response.json())
        .then((fbUser) => {
          this.setState({
            userPicture: fbUser.picture
          })
          fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(users => {
              const userExists = users.find(user => {
                return fbUser.id == user.fbId
              })
                if(userExists) {
                  this.setState({
                    currentUser: userExists
                  })
                  return this.props.navigation.navigate("User", {currentUser: this.state.currentUser, userPicture: this.state.userPicture})
                } else {
                  let newUser = {
                    fbId: fbUser.id,
                    name: fbUser.name,
                    email: fbUser.email,
                    picture: fbUser.picture
                  }
                  fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newUser)
                  })
                  .then(response => response.json())
                  .then(user => {
                    this.setState({
                      currentUser: user
                    })
                    return this.props.navigation.navigate("User", {currentUser: this.state.currentUser, userPicture: this.state.userPicture})
                  })
                  .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error))
        })
        .catch(() => {
          reject("ERROR GETTING DATA FROM FACEBOOK")
        })
      } else {
        Alert.alert("Unable to connect to Facebook")
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <SocialIcon
          title="Sign In With Facebook"
          button
          type="facebook"
          // onPress={() => this.props.navigation.navigate("User", {currentUser: this.state.currentUser, userPicture: this.state.userPicture})}
          onPress={this._login}
          style={{width: 300}}
        />

      </View>
    )
  }
}

export default StackNavigator ({
  Home: {
    screen: App,
  },
  User: {
    screen: User
  },
  AllUsers: {
    screen: AllUsers
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
