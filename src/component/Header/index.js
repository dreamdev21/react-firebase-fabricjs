import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../redux/action'
import UnderButton from '../UnderButton'
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
var Dropdown = require('react-simple-dropdown');
var DropdownTrigger = Dropdown.DropdownTrigger;
var DropdownContent = Dropdown.DropdownContent;
require('./index.css')

export default class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabState: this.props.tabState,
            showUserPop: false,
            name: 'Anonymous',
            email: 'No email'
        }
    }

    componentWillMount() {
        try{
            const userData = JSON.parse(localStorage.getItem('user'))
            this.setState({name: userData.name, email: userData.email})
        }
        catch(e){
            browserHistory.push('/')
        }
    }

    static propTypes = {
        tabState: PropTypes.string,
        onSignOut: PropTypes.func.isRequired,
    }

    static defaultProps = {
        onSignOut: () => undefined,
        tabState: 'Projects'
    }

    componentDidMount() {
    }

    handleClick () {
        this.setState({showUserPop: false})
    }

    onClick(title) {
        this.setState({tabState: title, showUserPop: false})
        switch(title) { 
            case 'Projects':
                browserHistory.push('/app/projects/all')
                break
            case 'Activity':
                browserHistory.push('/app/activity')
                break
            case 'Username':
                this.setState({showUserPop: !this.state.showUserPop})
				break
            default:
                return null
        }
    }

    signOut() {
        this.props.signOut()
    }

    render() {
        return (
            <header className="main">
                <button id="logo" onClick={() => this.onClick("Projects")}>H<span className="mobile-hide">opscotch</span>.</button>

                <nav onMouseLeave={() => this.setState({showUserPop: false})}>
                    <ul className="nav-menu">
                        <UnderButton 
                            isPressed={this.state.tabState === 'Projects'} 
                            text="Projects" 
                            onClick={() => this.onClick("Projects")}
                            onHover={() => this.setState({showUserPop: false})} />
                        <UnderButton 
                            isPressed={this.state.tabState === 'Activity'} 
                            text="Activity" 
                            onClick={() => this.onClick("Activity")} 
                            onHover={() => this.setState({showUserPop: false})} />
                        <UnderButton 
                            isPressed={this.state.tabState === 'Username'} 
                            text="Username" 
                            onClick={() => {this.onClick("Username") }} 
                            onHover={() => this.setState({showUserPop: true})} />
                        {
                            this.state.showUserPop?
                            <i className="icon icon-arrow-up"></i>
                            :
                            <i className="icon icon-arrow-down"></i>
                        }      
                        {
                            this.state.showUserPop?
                            <div className="sub-nav header-username-view" onMouseOut={() => this.setState({showUserPop: true})}>
                                <ul className="sub-nav-group">
                                    <li className="user-name truncate">{this.state.name}</li>
                                    <li className="user-email truncate">{this.state.email}</li>
                                    <li><a style={{fontSize: 18, color: 'black'}} href="/app/myaccount">My Account</a></li>
                                    <li><a style={{fontSize: 18, color: 'black'}} onClick={() => this.props.onSignOut()}>Sign Out</a></li>
                                </ul>
                            </div>
                            :null
                        }
                    </ul>
                </nav>
            </header>
        );
    }
}