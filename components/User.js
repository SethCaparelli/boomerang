import Expo from "expo"
import React, { Component } from "react"
import { Platform, Text, View, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Avatar, Button } from "react-native-elements"
import mapStyle from "../jsons/mapStyle.json"
import { Constants, MapView, Location, Permissions } from 'expo';

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
          mapRegion: null,
          hasLocationPermissions: false,
          locationResult: null,
          currentUser: this.props.navigation.state.params.currentUser,
          userPicture: this.props.navigation.state.params.userPicture
      }
    }

    componentDidMount() {
      const id = this.state.currentUser.fbId
      this._getLocationAsync()
      fetch(`http://localhost:3000/users/${id}`)
        .then(response => response.json())
        .then(user => {
            this.setState({currentUser: user})
        })
        .catch(error => console.log(error))
    }

    _handleMapRegionChange = mapRegion => {
      this.setState({ mapRegion });
    };

    _getLocationAsync = async () => {
     let { status } = await Permissions.askAsync(Permissions.LOCATION);
     if (status !== 'granted') {
       this.setState({
         locationResult: 'Permission to access location was denied',
       });
     } else {
       this.setState({ hasLocationPermissions: true })
     }

     let location = await Location.getCurrentPositionAsync({})
     this.setState({ locationResult: JSON.stringify(location) })

      this.setState({mapRegion: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }})
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
            <Text style={{color: "white", fontSize: 20, backgroundColor: "#173753", borderRadius: 30, width: 150, textAlign: "center"}}>{this.state.currentUser.name}</Text>
          </View>
          <MapView
            provider={Expo.MapView.PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={styles.map}
            region={this.state.mapRegion}
            onRegionChange={this._handleMapRegionChange}
            showsUserLocation={true}
            zoomEnabled={true}
            pitchEnabled={true}
            showsUserLocation={true}
            followsUserLocation={true}
          >
          {this.state.currentUser.spots.map((spot, i) => {
            return(
              <MapView.Marker
                coordinate={spot.location}
                title={spot.name}
                description={spot.address}
              />
            )
          })}
          </MapView>
          <View style={styles.buttonContainer}>
            {/* <Icon
              type="Ionicons"
              name="people" /> */}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("AllSpots", {currentUser: this.state.currentUser})}
              >
              <Image
                source={require("../assets/icons/boomerang_cocktail_icon.png")}
                style={styles.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("UsersFriends", {currentUser: this.state.currentUser})}
              >
              <Image
                source={require("../assets/icons/boomerang_user_icon.png")}
                style={styles.icon}
                />
            </TouchableOpacity>
          </View>
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
    flex: 0.15,
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
