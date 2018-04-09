import PropTypes from 'prop-types';
import React, { Component } from 'react';
const sample_pdf = require('../../resource/images/sample-pdf.png')
require('./index.css')

export default class FeedbackImage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hover: false,
            imageURL: null
        }
    }

    static propTypes = {
        url: PropTypes.string.isRequired,
        handle: PropTypes.object.isRequired,
        onPreviewImage: PropTypes.func.isRequired
    }

    static defaultProps = {
        onPreviewImage: () => undefined,
    }

    componentDidMount() {
        this.mounted = true
        this.showFeedbackImage(this.props.url)
        this.startLoadingAnimation()
    }

    componentWillUnmount() {
        this.mounted = false
    }
    
    startLoadingAnimation() {
        const _this = this
        if(this.state.loadingViewHeight === 0){
            this.mounted && this.setState({loadingViewHeight: 240})
        }
        else{
            this.mounted && this.setState({loadingViewHeight: 0})
        }
        setTimeout(function() {
            if(_this.state.imageURL === null) _this.mounted && _this.startLoadingAnimation()
        }, 1000)
    }

    showFeedbackImage(url) {
        if(url === 'pdf') this.setState({imageURL: sample_pdf})
        this.props.handle.getFileWithName(url, (url) => {
            this.mounted && this.setState({imageURL: url})
        })
    }

    render() {
        return (
            <div className="item-image" style={{backgroundImage: "url(" + this.state.imageURL + ")" }} onMouseOver={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
                {
					this.state.imageURL === null?
                    <div className='work-loading-view' style={{height: this.state.loadingViewHeight}}/>
                    :<div className="item-overlay"><div><button type="button" className="transparent" onClick={() => this.props.onPreviewImage(this.state.imageURL)}>View</button></div></div>
                }                              
            </div>
        );
    }
}