import Expo from "expo"
import React, { Component } from "react"
import { Platform, Text, View, StyleSheet } from "react-native"
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
      this._getLocationAsync();
    }

    _handleMapRegionChange = mapRegion => {
      console.log(mapRegion);
      this.setState({ mapRegion });
    };

    _getLocationAsync = async () => {
     let { status } = await Permissions.askAsync(Permissions.LOCATION);
     if (status !== 'granted') {
       this.setState({
         locationResult: 'Permission to access location was denied',
       });
     } else {
       this.setState({ hasLocationPermissions: true });
     }

     let location = await Location.getCurrentPositionAsync({});
     this.setState({ locationResult: JSON.stringify(location) });

     // Center the map on the location we just fetched.
      this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
    };

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
            // showsCompass={true}
            // showsBuildings={true}
            // showsTraffic={true}
            // showsIndoors={true}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Boomerangers"
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
    flex: 0.1,
    backgroundColor: "black",
    width: "100%"
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
  }

})

// navigator.geolocation.getCurrentPosition(
//   ({ coords }) => {
//     if (this.map) {
//       this.map.animateToRegion({
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005
//       })
//     }
//   },
//   (error) => alert('Error: Are location services on?'),
//   { enableHighAccuracy: true }
// )