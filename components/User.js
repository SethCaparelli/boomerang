import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';

export default class Map extends Component {
  constructor(props) {
    super(props)
      this.state = {
        currentUser: this.props.navigation.state.params.currentUser,
        location: null,
        errorMessage: null,
      }
  }

  componentWillMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    let pointLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    }
    this.setState({
        location: pointLocation
    })
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
      {this.state.location
        ?
        <MapView
            style={{width: 300, height: 400 }}
            initialRegion={{
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude,
                latitudeDelta: 0.00000001,
                longitudeDelta: 0.000001
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            provider="google"
        />
        : <Text>...Loading</Text>}
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});