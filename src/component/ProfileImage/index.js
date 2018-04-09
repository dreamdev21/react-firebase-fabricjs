import PropTypes from 'prop-types';
import React, { Component } from 'react';
require('./index.css')

export default class ProfileImage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {}
        }
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        handle: PropTypes.object.isRequired
    }

    static defaultProps = {
        
    }

    componentDidMount() {
        this.props.handle.getUserDetails(this.props.id, (user) => {
            console.log(this.props.id + ' User Data:', user)
            this.setState({user})
        })
    }

    componentWillReceiveProps(props) {
        if(this.props.id !== this.state.user.uid){
            this.setState({user: {}})
            this.props.handle.getUserDetails(this.props.id, (user) => {
                console.log(this.props.id + ' User Data:', user)
                this.setState({user})
            })
        }
    }

    render() {
        if(this.state.user.uid === undefined){
            return null
        }
        else if(this.state.user.photo === undefined){
            return(
                <div className="profile-image-avatar">
                    {this.state.user.name.split(' ')[0].substring(0, 1)}
                    {this.state.user.name.split(' ')[1].substring(0, 1)}
                </div>
            )
        }
        return (
            <div className="user-photo" style={{backgroundImage: "url(" + this.state.user.photo + ")"}}></div>
        );
    }
}