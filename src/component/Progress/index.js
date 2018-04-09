import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Line, Circle} from 'rc-progress'
require('./index.css')

export default class ProgressCircle extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    static propTypes = {
        percent: PropTypes.number.isRequired,
        strokeWidth: PropTypes.number.isRequired,
    }

    getProgressCircleColor(){
        const percent = this.props.percent
        const R = String(Math.floor(40 + 10 * percent / 100)) 
        const G = String(Math.floor(160 + 40 * percent / 100)) 
        const B = String(Math.floor(200 + 55 * percent / 100)) 
        return 'rgb(' + R + ',' + G + ',' + B + ')'
    }

    render() {
        return (
            <div className="work-progress-container">
                <Circle 
                    className="work-progress-circle" 
                    percent={this.props.percent} 
                    strokeWidth={this.props.strokeWidth} 
                    trailWidth={this.props.strokeWidth}
                    strokeColor={this.getProgressCircleColor()}/>
                <div className="work-progress-text-view">
                    <p style={{margin: 0, color: this.getProgressCircleColor()}}>{Math.floor(this.props.percent)} %</p>
                </div>
            </div>
        );
    }
}