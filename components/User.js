import Expo from 'expo';
import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions, Components } from 'expo';
import { Avatar, Button } from "react-native-elements"
import mapStyle from "../jsons/mapStyle.json"


const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
        location: {
          coords: {
            latitude: 0,
            longitude: 0}
          },
          currentUser: this.props.navigation.state.params.currentUser,
          userPicture: this.props.navigation.state.params.userPicture
      }
    }
  componentWillMount() {
    Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
  }

  locationChanged = (location) => {
    region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.05,
    },
    this.setState({location, region})
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Avatar
                large
                rounded
                source={{uri: this.state.userPicture.data.url}}
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
              />
            <Text style={{color: "white", fontSize: 20}}>{this.state.currentUser.name}</Text>
          </View>
          <Expo.MapView
            provider={Expo.MapView.PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={styles.map}
            showsUserLocation={true}
            region={this.state.region}
          />
          <View style={styles.buttonContainer}>
            <Button
              title='Boomerangers'
              onPress={() => this.props.navigation.navigate("AllUsers", {currentUser: this.state.currentUser})}
              buttonStyle={{
                backgroundColor: "rgba(92, 99,216, 1)",
                width: 300,
                height: 45,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
              }}
            />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  buttonContainer: {
    flex: 0.25
  },
  avatarContainer: {
    flex: 0.15,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  map: {
    zIndex: 0,
    flex: 0.75,
    width: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }

})