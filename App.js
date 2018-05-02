import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';



export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {}
    }
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
        Alert.alert("Unable to connect to facebook")
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this._login}
        >
          <Text>FaceBook</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
