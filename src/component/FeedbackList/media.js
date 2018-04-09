import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Document, Page } from 'react-pdf';
require('./index.css')
const sample_pdf = require('../../resource/images/sample-pdf.png')

export default class FirebaseMedia extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hover: false,
            mediaURL: '',
            pageWidth: 400
        }
    }

    static propTypes = {
        url: PropTypes.string.isRequired,
        handle: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired,
        disable: PropTypes.bool
    }

    static defaultProps = {

    }

    componentDidMount() {
        this.mounted = true
        // console.log('Video URL: ', this.props.url
        if(this.props.file !== undefined){
          if(this.props.file.type === 'PDF'&&this.props.handle.location.pathname.match(/works/)){
            const htmlNamePath = 'files/'+this.props.file.htmlName;
            this.props.handle.getFileWithName(htmlNamePath, (url) => {

              this.mounted && this.setState({mediaURL: url})
              console.log('Html for pdf URL:', url)
            })
          }else{
            const tempNamePath = 'thumbnail/'+this.props.file.tempName;
            this.props.handle.getFileWithName(tempNamePath, (url) => {

              this.mounted && this.setState({mediaURL: url})
              console.log('Video URL:', url)
            })
          }
        }else{
          this.props.handle.getFileWithName(this.props.url, (url) => {

            console.log('No props passed', url)
            this.mounted && this.setState({mediaURL: url})
            console.log('Video URL:', this.props.url);
          })
        }
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        this.mounted = false
    }

    updateDimensions() {
        if(this.props === undefined) return
        const width = document.getElementById(this.props.url).offsetWidth
        this.setState({pageWidth: width})
    }

    onError(e) {
        console.log('File Load Error: ', e)
    }

    onDocumentLoad(numPages) {
        const width = document.getElementById(this.props.url).offsetWidth
        this.setState({pageWidth: width})
    }

    render() {
        console.log('Audio File Path', this.state.mediaURL)
        if(this.props.type === 'audio'){
            return(
                <audio src={this.state.mediaURL} controls width="100%" height="100%"/>
            )
        }
        else if(this.props.type === "pdf"){
            const type="pdf"
          console.log("From new media", this.props.handle.location);
            return(
				 !this.props.handle.location.pathname.match(/works/) ? <div className="document-thumb" style={{backgroundImage: "url(" + this.state.mediaURL + ")" }}></div>
                    :
                    <div className="full-item"><div className="full-item-inner document-container">
                      <iframe title="Document Viewer" src={this.state.mediaURL}></iframe>
                    </div></div>
                  
			 )
        }
        else if(this.props.type === 'video' && this.props.disable){
            return (
                <ReactPlayer url={this.state.mediaURL} width="100%" height="100%" className="video-item-cover"/>
            );
        }
        else{
            return (
                <ReactPlayer url={this.state.mediaURL} controls width="100%" height="100%"/>
            );
        }

    }
}
