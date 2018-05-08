import React, { Component } from 'react'
import { View, Text } from "react-native"

export default class Boomerangs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser = this.props.navigation.state.params.currentUser
        }
    }

    componentDidMount() {
        fetch(`http://localhost:3000/users/${id}`)
        .then(response => response.json())
        .then(user => {
            this.setState({currentUser: user})
        })
        .catch(error => console.log(error))
    }

    render() {
        return (
            <View>
            </View>
        )
    }
}
