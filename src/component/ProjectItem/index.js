import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Loading from 'react-loading-bar'
import FirebaseMedia from '../FeedbackList/media'
import ProfileImage from '../ProfileImage'


require('./index.css')
const person = require('../../resource/images/person.png')
const sample_word = require('../../resource/images/sample-word.png')
const sample_video = require('../../resource/images/sample-video.png')
const sample_audio = require('../../resource/images/sample-audio.png')
const sample_pdf = require('../../resource/images/sample-pdf.png')

export default class ProjectItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            onHover: false,
            project: {},
            isLoading: false,
            work: {},
            projectOwner: 'adb'
        }
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        isFile: PropTypes.bool.isRequired,
        onDownload: PropTypes.func,
        onDelete: PropTypes.func,
        onNavigate: PropTypes.func.isRequired,
        onLoad: PropTypes.func,
        handle: PropTypes.object,
        isShared: PropTypes.bool
    }

    static defaultProps = {
        onDownload: () => undefined,
        onDelete: () => undefined,
        onNavigate: () => undefined,
        onLoad: () => undefined
    }

    componentWillMount() {
        this.mounted = true
        this.mounted && this.setState({isLoading: true})
        this.props.handle.getProjectDetail(this.props.id, (project) => {
            this.mounted && this.setState({project})
            this.mounted && this.setProjectImage(project)
            this.mounted && this.setState({isLoading: false})
            this.mounted && this.props.onLoad(project)
        })
    }

    componentWillReceiveProps(props) {
        if(this.props.id !== this.state.project.project_id){
            this.setState({imageURL: null, work: {}})
            this.mounted && this.setState({isLoading: true})
            this.props.handle.getProjectDetail(this.props.id, (project) => {
                this.mounted && this.setState({project})
                this.mounted && this.setProjectImage(project)
                this.mounted && this.setState({isLoading: false})
            })
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    setProjectImage(project) {        
        if(project.workIds === undefined) this.setState({imageURL: sample_video})        
        else{
            const works = JSON.parse(project.workIds)
            if(works.length === 0){
                this.setState({imageURL: sample_video})
            } 
            else{   
                this.props.handle.getWorkDetails(works[0], (work) => {
                    console.log('First Work of the project: ', work)
                    if (work.type === 'PDF' || work.type === 'PDF'){
                        work.image = 'thumbnail/'+work.tempName;
                    }
                    this.setState({work})
                    this.getWorkImage(work)
                })
            }            
        }
        this.getUserName(project.uid)    
    }

    getWorkImage(file) {
        console.log('New test', file);
        if(file.type === 'AUDIO' || file.type === 'MP3') this.mounted && this.setState({imageURL: sample_audio})
        else if(file.type === 'VIDEO' || file.type === 'MP4') this.mounted && this.setState({imageURL: sample_video})
        else {
                this.props.handle.getFileWithName(file.image, (url) => {
                this.mounted && this.setState({imageURL: url})
            })
        }        
    }    

    getUserName(uid) {
        this.props.handle.getUserDetails(uid, (user) => {
            this.setState({projectOwner: user.name})
        })
    }

    render() {
        const {work} = this.state
        if(this.state.isLoading){
            return(
                <div className="project-card">
                    <div className="project-loading-text">
                        
                    </div>
                </div>
            )
        }
        else{
            return (
                    <div className="item" data-id={this.props.id} data-title={this.state.project.name}>
                        { /* this.state.project.image === undefined ? sample_video : this.getImageWithURL(this.state.project.image) */ }
                        {
                            work.type === undefined?
                            <div className="item-image" style={{backgroundImage: "url(" + this.state.imageURL + ")" }}>
                                <div className="item-overlay">
                                    <div>
                                        <button type="button" className="transparent" onClick={() => this.props.onNavigate()}>VIEW</button>
                                        <p>{this.state.project.feedback} Feedback</p>
                                        <div className="item-overlay-buttons">
                                            <button type="button" data-tooltip="Download" className="icon" onClick={() => this.props.onDownload()}>
                                                <i className="icon-download"></i>                                            
                                            </button>                                        
                                            <button type="button" data-tooltip="Delete" className="icon" onClick={() => this.props.onDelete(this.state.project)}>
                                                <i className="icon-trash"></i>
                                            </button>                                       
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :work.type === 'PDF'?
                            <div className="item-image">
                                <FirebaseMedia type="pdf" url={work.image} handle={this.props.handle}/>
                                <div className="item-overlay">
                                    <div>
                                        <button type="button" className="transparent" onClick={() => this.props.onNavigate()}>VIEW</button>
                                        <p>{this.state.project.feedback} Feedback</p>
                                        <div className="item-overlay-buttons">
                                            <button type="button" data-tooltip="Download" className="icon" onClick={() => this.props.onDownload()}>
                                                <i className="icon-download"></i>                                            
                                            </button>                                        
                                            <button type="button" data-tooltip="Delete" className="icon" onClick={() => this.props.onDelete(this.state.project)}>
                                                <i className="icon-trash"></i>
                                            </button>                                      
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :work.type === 'VIDEO' || work.type === 'MP4'?
                            <div className="item-image">
                                <FirebaseMedia type="video" url={work.image} handle={this.props.handle} disable={true}/>
                                <div className="item-overlay">
                                    <div>
                                        <button type="button" className="transparent" onClick={() => this.props.onNavigate()}>VIEW</button>
                                        <p>{this.state.project.feedback} Feedback</p>
                                        <div className="item-overlay-buttons">
                                            <button type="button" data-tooltip="Download" className="icon" onClick={() => this.props.onDownload()}>
                                                <i className="icon-download"></i>                                            
                                            </button>                                        
                                            <button type="button" data-tooltip="Delete" className="icon" onClick={() => this.props.onDelete(this.state.project)}>
                                                <i className="icon-trash"></i>
                                            </button>                                     
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                            :
                            <div className="item-image" style={{backgroundImage: "url(" + this.state.imageURL + ")" }}>
                                <div className="item-overlay">
                                    <div>
                                        <button type="button" className="transparent" onClick={() => this.props.onNavigate()}>VIEW</button>
                                        <p>{this.state.project.feedback} Feedback</p>
                                        <div className="item-overlay-buttons">
                                            <button type="button" data-tooltip="Download" className="icon" onClick={() => this.props.onDownload()}>
                                                <i className="icon-download"></i>                                            
                                            </button>                                        
                                            <button type="button" data-tooltip="Delete" className="icon" onClick={() => this.props.onDelete(this.state.project)}>
                                                <i className="icon-trash"></i>
                                            </button>                                     
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        
                        {
                            !this.props.isShared?
                            <h3 className="truncate"><a onClick={() => this.props.onNavigate()}>{this.state.project.name}</a></h3>
                            :
                            <div className="shared-project-bottom-view">
                                <ProfileImage id={this.state.project.uid} handle={this.props.handle} />
                                <div className="shared-project-bottom-right">
                                    <p className="shared-project-owner">{this.state.projectOwner}</p>
                                    <p className="shared-project-name">{this.state.project.name}</p>
                                </div>
                            </div>
                        }             
                    </div>
            );
        }
        
    }
}
