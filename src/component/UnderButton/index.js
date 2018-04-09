import PropTypes from 'prop-types';
import React, { Component } from 'react';
require('./index.css')

export default class UnderButton extends Component {

    constructor(props) {
        super(props)
        this.state = {
            onFocus: false
        }
    }

    static propTypes = {
        isPressed: PropTypes.bool.isRequired,
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        onHover: PropTypes.func,
        onBlur: PropTypes.func
    }

    static defaultProps = {
        onClick: () => undefined,
        onHover: () => undefined,
        onBlur: () => undefined,
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <li className="main-nav-link">
                <button
					className={!this.props.isPressed ? "nav-item" : "nav-item current" }
                    onClick={() => this.props.onClick()}
                    onMouseOut={() => {
                        this.setState({onFocus: false})
                        this.props.onBlur()
                    }}
                    onMouseOver={() => {
                        this.setState({onFocus: true})
                        this.props.onHover()
                    }}>
                    {this.props.text}
                </button>
            </li>
        );
    }
}