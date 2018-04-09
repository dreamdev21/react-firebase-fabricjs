import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import InvalidIcon from 'react-icons/lib/md/not-interested'
require('./index.css')

export default class InvalidPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }
    
    render() {
        return (
            <div className="invalid-page-container">
                <center><InvalidIcon size={50} color='red'/></center>
                <center className="invalid-text-1">Invalid Page</center>
                <center className="invalid-text-2">Are you going to visit Hopscotch.co?</center>
                <a href="/"><center className="invalid-text-3">Go To Log In Page</center></a>
            </div>
        );
    }
}