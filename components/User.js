import Expo from 'expo';
import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Avatar, Button } from "react-native-elements"
import Icon from 'react-native-vector-icons'

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };


export default class User extends Component {
  constructor(props) {
    super(props)
      this.state = {
        currentUser: this.props.navigation.state.params.currentUser,
        location: {
          coords: {
          latitude: 0,
          longitude: 0
          }
        },
        locationResult: null,
        userPicture: this.props.navigation.state.params.userPicture
    }
  }

  static navigationOptions = {
    title: "User"
  }

  // componentDidMount() {
  //   Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged)
  //   .catch(error => {
  //     console.error('Location.watchPositionAsync', error)
  //     this.setState({error: error.message})
  //   })
  // }

//   componentDidMount() {
//     this._getLocationAsync();
//   }

//   _getLocationAsync = async () => {
//    let { status } = await Permissions.askAsync(Permissions.LOCATION);
//    if (status !== 'granted') {
//      this.setState({
//        locationResult: 'Permission to access location was denied',
//      });
//    }

//    let location = await Location.watchHeadingAsync(GEOLOCATION_OPTIONS, this.locationChanged);
//    this.setState({ location });
//  }

//  locationChanged = (location) => {
//   region = {
//     latitude: location.coords.latitude,
//     longitude: location.coords.longitude,
//     // latitude: 39.7574486,
//     // longitude: -105.0068207,
//     latitudeDelta: 0.1,
//     longitudeDelta: 0.05,
//   },
//   this.setState({location, region, error: undefined})
// }


  render() {
    return (
      <View style={styles.container}>
        <Avatar
          xlarge
          rounded
          source={{uri: this.state.userPicture.data.url}}
          activeOpacity={0.7}
        />
        {this.state.error && <Text>{this.state.error}</Text>}

          <Expo.MapView
            style={styles.map}
            showsUserLocation={true}
            region={this.state.location}
          />
          <View style={styles.buttons}>
          <Button
            onPress={() => this.props.navigation.navigate("AllUsers", {currentUser: this.state.currentUser})}
            buttonStyle={{
              backgroundColor: "rgba(92, 99,216, 1)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5
            }}
            title='See Other Users'
          />
          </View>
        </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  map: {
    flex: 3,
    width: "100%",
    height: 300
  },
  buttons: {
    flex: 1,

  }
})