import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
// import { StackNavigator } from "react-navigation"
import User from "./components/User"



export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {}
    }
  }
  static navigationOptions = {
    title: 'Home'
  }

  _login = () => {
    Expo.Facebook.logInWithReadPermissionsAsync("593366027693002", {
      permissions: ["public_profile"]
    })
    .then(response => {
      console.log(response)
      const { token, type } = response
      if(type === "success") {
        fetch(`https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=${token}&fields=id,name,picture.type(large)`)
        .then((response) => response.json())
        .then((fbUser) => {
          console.log(fbUser)
          fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(users => {
              console.log(users)
              const userExists = users.find(user => {
                return fbUser.id == user.fbId
              })
                console.log(userExists)
                if(userExists) {
                  this.setState({
                    currentUser: userExists
                  })
                  return this.props.navigation.navigate("User", {currentUser: this.state.currentUser})
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
                    return this.props.navigation.navigate("User", {currentUser: this.state.currentUser})
                  })
                  .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error))
        })
        .catch(() => {
          reject('ERROR GETTING DATA FROM FACEBOOK')
        })
      } else {
        Alert.alert("Unable to connect to Facebook")
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <User />
        <TouchableOpacity
          onPress={this._login}
        >
          <Text>FaceBook</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// export default StackNavigator ({
//   Home: {
//     screen: App,
//   },
//   User: {
//     screen: User
//   }
// })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
