import React, { Component } from 'react'
import { View, Text } from "react-native"
import { ListItem } from 'react-native-elements'

export default class AllUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    static navigationOptions = {
        title: 'Boomerangers'
      }

    componentDidMount() {
        fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(users => {
            this.setState({users})
        })
    }
  render() {
    return (
      <View>
        {
            this.state.users.map((user, i) => (
            <ListItem
                key={i}
                avatar={{ source: { uri: user.picture.data.url } }}
                title={user.name}
                // subtitle={l.subtitle}
            />
            ))
        }
      </View>
    )
  }
}
