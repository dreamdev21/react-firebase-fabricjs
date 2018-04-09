import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import firebase from 'firebase'
import ProgressCircle from '../Progress'
import FirebaseMedia from '../FeedbackList/media'
import * as Controller from '../../lib/controller'
import { Document, Page } from 'react-pdf';
import axios from 'axios';

require('./index.css')
const sample_word = require('../../resource/images/sample-word.png')
const sample_video = require('../../resource/images/sample-video.png')
const sample_audio = require('../../resource/images/sample-audio.png')
const sample_pdf = require('../../resource/images/sample-pdf.png')
const contentHight = 240//must change in css
// axios.defaults.baseURL = 'http://cloudconvert-palash.codeanyapp.com:4000/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default class WorkItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            file: {},
            imageURL: null,
            loadingViewHeight: 0,
            percent: 0,
        }
    }

    static propTypes = {
        file: PropTypes.object.isRequired,
        project: PropTypes.object.isRequired,
        onDownload: PropTypes.func,
        onDelete: PropTypes.func,
        onNavigate: PropTypes.func.isRequired,
        handle: PropTypes.object.isRequired,
        onCompleteUpload: PropTypes.func,
        isOwn: PropTypes.bool
    }

    static defaultProps = {
        onDownload: () => undefined,
        onDelete: () => undefined,
        onNavigate: () => undefined,
        isOwn: false
    }

    componentWillMount() {
        const _this = this
        this.mounted = true
        this.startLoadingAnimation()
        if(this.props.file.state === undefined){
            //new uploaded work
            this.mounted && this.setState({file: this.props.file})

            console.log('Props File: ', this.props.file)
          // return false
            let UploadTask = firebase.storage().ref(this.props.file.image.replace('%2E','.')).put(this.props.file.file)
            UploadTask.on('state_changed', function(snapshot){
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                _this.mounted && _this.setState({percent: progress})
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
	              default:
	                return null
                }
            }, function(error) {
                // Handle unsuccessful uploads
            }, async() => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              console.log('Snapshot: ',UploadTask.snapshot);
                var downloadURL = UploadTask.snapshot.downloadURL;
                var inputFileName = UploadTask.snapshot.metadata.name;
                const inputFileType = inputFileName.split(".")[1];
                const allowedTypes = ['abw', 'doc', 'docm', 'docx', 'lwp', 'md', 'odt', 'pages', 'pages.zip', 'pdf', 'rst', 'rtf', 'sdw', 'txt', 'wpd', 'wps', 'zabw', 'htm', 'dps', 'key','key.zip', 'odp', 'pps', 'ppsx', 'ppt', 'pptm', 'pptx', 'ps', 'sda', 'csv','et', 'numbers', 'numbers.zip', 'ods', 'sdc', 'xls', 'xlsm', 'xlsx'];

              console.log('Input File Type: ', inputFileType);
                for(var i =0; i < allowedTypes.length; i++) {
                  if(allowedTypes[i] === inputFileType){
                    console.log('Allowed Type: ', allowedTypes[i]);
                    console.log('Download URL: ', downloadURL);
                    //execute the code to cloudconvert via axios
                    console.log('execute the code to cloudconvert via axios');
                    // return false;
                    const res = await axios.post('https://hopscotch-4a440.firebaseapp.com/api/convert', {
                      inputformat: inputFileType,
                      fileUrl: downloadURL,
                      inputfilename: inputFileName
                    });
                    const data = await res.data;
                    console.log('Axios response: ',data);
                    const htmlFileName = data.html.filename;
                    const thumbnailFileName = data.thumbnail.filename;
                    _this.props.file.htmlName = htmlFileName;
                    _this.props.file.tempName = thumbnailFileName;
                    console.log('Modified file object: ',_this.props.file);
                    const storagePathHtml = 'gs://hopscotch-4a440.appspot.com/files/'+htmlFileName;
                    const storagePathThumbnail = 'gs://hopscotch-4a440.appspot.com/thumbnail/'+thumbnailFileName;
                    console.log('Storage Path Html: ', storagePathHtml);
                    console.log('Storage Path Thumbnail: ', storagePathThumbnail);
                    firebase.storage().refFromURL(storagePathHtml).getDownloadURL().then(function(url) {
                      const downloadUrlHtml = url;
                      console.log('HTML download URL: ',downloadUrlHtml);
                    })
                    firebase.storage().refFromURL(storagePathThumbnail).getDownloadURL().then(function(url) {
                      const downloadUrlThumbnail = url;
                      console.log('Thumbnail download URL: ',downloadUrlThumbnail);
                    })

                  }
                }

                _this.props.onCompleteUpload()
                _this.props.handle.createWork(_this.props.file, _this.props.project, (res) => {
                    console.log('Work_id '+ res + ' has been created')
                })
                if(_this.props.file.type === 'WORD')
                    _this.mounted && _this.setState({imageURL: sample_word})
                else if(_this.props.file.type === 'AUDIO' || _this.props.file.type === 'MP3')
                    _this.mounted && _this.setState({imageURL: sample_audio})
                else if(_this.props.file.type === 'PDF')
                    _this.mounted && _this.setState({imageURL: sample_pdf})
                else if(_this.props.file.type === 'VIDEO' || _this.props.file.type === 'MP4')
                    _this.mounted && _this.setState({imageURL: sample_video})
                else
                    _this.mounted && _this.setState({imageURL: downloadURL})
            });
        }
        else{
            //existing work
            this.props.handle.getWorkDetails(this.props.file.work_id, (file) => {
              console.log('Existing',file);
              // file.image = 'https://firebasestorage.googleapis.com/v0/b/hopscotch-4a440.appspot.com/o/files%2Fnicolesy-australia-1250%252Ejpg?alt=media&token=7a7e7f30-438f-43d6-9d4f-c86a8c33478b';
                this.mounted && this.setState({file})
                this.getWorkImage(file)
            })
        }
    }

    componentWillReceiveProps(props) {
        //existing
        if(this.props.file.work_id !== this.state.file.work_id){
            this.setState({imageURL: null})
            this.props.handle.getWorkDetails(this.props.file.work_id, (file) => {
                this.mounted && this.setState({file})
                this.getWorkImage(file)
            })
        }

    }

    componentWillUnmount() {
        this.mounted = false
    }

    startLoadingAnimation() {
        const _this = this
        if(this.state.loadingViewHeight === 0){
            this.mounted && this.setState({loadingViewHeight: contentHight})
        }
        else{
            this.mounted && this.setState({loadingViewHeight: 0})
        }
        setTimeout(function() {
            if(_this.state.imageURL === null) _this.mounted && _this.startLoadingAnimation()
        }, 1000)
    }

    onClickTitle() {
        if(!this.props.isFile){
            this.props.onNavigate()
        }
    }

    getWorkImage(file) {
        if(file.type === 'AUDIO' || file.type === 'MP3') this.mounted && this.setState({imageURL: sample_audio})
        else if(file.type === 'VIDEO' || file.type === 'MP4') this.mounted && this.setState({imageURL: sample_video})
        else {
            if(file.type === 'PDF' || file.type === 'WORD'){
              const thumbUrl = 'thumbnail/'+file.tempName;
              this.props.handle.getFileWithName(thumbUrl, (url) => {
                console.log('getWorkImg URL', url);
                this.mounted && this.setState({imageURL: url})
              })
            }else {
              this.props.handle.getFileWithName(file.image, (url) => {
                this.mounted && this.setState({imageURL: url})
              })
            }

        }
    }

    render() {
        // console.log('Work Type: ', this.props.file)
        return (
                    <div className="item">
                    {
                        this.state.percent > 0 && this.state.percent < 100?
                        <div className='work-loading-container'>
                            <ProgressCircle percent={this.state.percent} strokeWidth={10} />
                        </div>
                        :this.state.imageURL === null || this.state.file === {}?
                        <div className='work-loading-container'>
                            <div className='item-image work-loading-view' style={{height: this.state.loadingViewHeight}}/>
                        </div>
                        :this.state.file.type === 'PDF'?
                        <div className="item-image">
                            <FirebaseMedia file={this.props.file} type="pdf" url={this.state.file.image} handle={this.props.handle}/>
                            <div className="item-overlay">
                                <div>
                                    <button type="button" className="transparent" onClick={() => this.props.onNavigate()}>VIEW</button>
                                    <p>{this.state.file.feedback} Feedback</p>
                                    <div className="item-overlay-buttons">

                                        <button type="button" data-tooltip="Download" className="icon" onClick={() => this.props.onDownload()}>
                                            <i className="icon-download"></i>
                                        </button>
                                        {
                                            this.props.isOwn?
                                            <button type="button" data-tooltip="Delete" className="icon" onClick={() => this.props.onDelete(this.state.file)}>
                                                <i className="icon-trash"></i>
                                            </button>
                                            :null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        :this.state.file.type === 'VIDEO' || this.state.file.type === 'MP4'?
                        <div className="item-image">
                            <FirebaseMedia file={this.props.file} type="video" url={this.state.file.image} handle={this.props.handle} disable={true}/>
                            <div className="item-overlay">
                                <div>
                                    <button type="button" className="transparent" onClick={() => this.props.onNavigate()}>VIEW</button>
                                    <p>{this.state.file.feedback} Feedback</p>
                                    <div className="item-overlay-buttons">
                                        <button type="button" data-tooltip="Download" className="icon" onClick={() => this.props.onDownload()}>
                                            <i className="icon-download"></i>
                                        </button>
                                        {
                                            this.props.isOwn?
                                            <button type="button" data-tooltip="Delete" className="icon" onClick={() => this.props.onDelete(this.state.file)}>
                                                <i className="icon-trash"></i>
                                            </button>
                                            :null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="item-image" style={{backgroundImage: "url(" + this.state.imageURL + ")" }}>
                            <div className="item-overlay">
                                <div>
                                    <button type="button" className="transparent" onClick={() => this.props.onNavigate()}>VIEW</button>
                                    <p>{this.state.file.feedback} Feedback</p>
                                    <div className="item-overlay-buttons">
                                        <button type="button" data-tooltip="Download" data-flow="up" className="icon" onClick={() => this.props.onDownload()}>
                                            <i className="icon-download"></i>
                                        </button>
                                        {
                                            this.props.isOwn?
                                            <button type="button" data-tooltip="Delete" data-flow="up" className="icon" onClick={() => this.props.onDelete(this.state.file)}>
                                                <i className="icon-trash"></i>
                                            </button>
                                            :null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <h3 className="truncate">
                        {this.state.file.name !== undefined ? Controller.myDecode(this.state.file.name) : ''}
                        <span>{this.state.file.type === undefined ? '' : this.state.file.type.toUpperCase()}</span>
                    </h3>
                </div>
        );
    }
}
