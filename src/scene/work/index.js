
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../redux/action'
import {Canvas,Circle, Image, Path, Text} from 'react-fabricjs';
import {fabric} from 'fabric';
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Notifications, {notify} from 'react-notify-toast';
import * as controller from '../../lib/controller'

import FileDrop from '../../component/FileDrop'
import firebase from 'firebase'
import FeedbackList from '../../component/FeedbackList'
import FirebaseMedia from '../../component/FeedbackList/media'
import DeleteForm from '../../component/Delete'


require('./index.css')
const sample_word = require('../../resource/images/sample-word.png')
const sample_video = require('../../resource/images/sample-video.png')
const sample_audio = require('../../resource/images/sample-audio.png')
const sample_pdf = require('../../resource/images/sample-pdf.png')
const loadingIcon = require('../../resource/gif/loading.svg')

class WorkItemView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            work_ids: [],
            workNumber: 0,
            workIndex: this.props.params.index !== undefined ? this.props.params.index : 1,
            file: {},
            empty: false,
            workContent: null,
            isLoading: true,
            project_id: this.props.params.id,
            fileName: '',
            description: '',
            OwnProject: null,
            isFBMaking: false,
            isDrawing: false,
            fbArray: [],
            fbState: '',
            isUploading: false,
            isDeleteComment: false
        }
        
    }

    componentWillMount() {
        this.mounted = true
        try{
            const userData = localStorage.getItem('user')
            const checkName = userData.name
        }
        catch(e){
            browserHistory.push('/')
            return
        }
        this.props.getWorks(this.props.params.id, (project) => {
            this.setState({OwnProject: true, project})
            if(project.uid !== localStorage.getItem('uid')){
                this.setState({OwnProject: false})
            }

            if(project.workIds === undefined){
                this.setState({empty: true})
            }
            //prevent manual link with over work index
            else if(JSON.parse(project.workIds).length < this.state.workIndex){
                browserHistory.push('/*')
            }
            else{
                const temp = JSON.parse(project.workIds)
                console.log('Redux_workIds: ', this.props.r_sorted_workIds)
                if(this.props.r_sorted_workIds.length === 0){
                    this.props.setSortedWorkIds(temp)
                    this.showCurrentWork(temp[this.state.workIndex - 1])
                    console.log('sorted work ids has been formated!')
                }
                else{
                    this.showCurrentWork(this.props.r_sorted_workIds[this.state.workIndex - 1])
                }
                this.setState({workNumber: temp.length})

            }
        })
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }
   

    _handleKeyDown(event) {
        const ESCAPE_KEY = 27;
        switch( event.keyCode ) {
            case ESCAPE_KEY:
                if(this.state.isPreviewImage){
                    this.setState({isPreviewImage: false})
                }
                break;
            default:
                break;
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    showCurrentWork(workId) {
        console.log('current workId is', workId)
        this.mounted && this.setState({isLoading: true})
        this.props.getWorkDetails(workId, (file) => {
            this.mounted && this.setState({
                file,
                fileName: controller.myDecode(file.name),
                description: file.description === undefined ? '' : file.description
            })
            this.showContentImage(file)
        })
    }

    onBackToProjectPage() {
        browserHistory.push('/app/projects/' + this.state.project_id)
    }

    showContentImage(file) {
        console.log('Selected File: ', file)
        if(file.type === undefined) return
        switch(file.type.toUpperCase()){
            case 'PDF':
                var htmlPathPdf = 'files/'+file.htmlName;
                this.props.getFileWithName(htmlPathPdf, (url) => {
                  this.mounted && this.setState({workContent: url, isLoading: false})
                })
                break
            case 'VIDEO':
                this.setState({workContent: sample_video, isLoading: false})
                break
            case 'AUDIO':
                this.setState({workContent: sample_audio, isLoading: false})
                break
            case 'MP3':
                this.setState({workContent: sample_audio, isLoading: false})
                break
            case 'WORD':
                var htmlPath = 'files/'+file.htmlName;
                this.props.getFileWithName(htmlPath, (url) => {
                  this.mounted && this.setState({workContent: url, isLoading: false})
                })
                break
            default:
                this.props.getFileWithName(file.image, (url) => {
                    this.mounted && this.setState({workContent: url, isLoading: false})
                })
                break
        }
    }

    onClickNextButton(offset) {
        let newIndex = Number(this.state.workIndex) + offset
        if(newIndex === 0) newIndex = this.state.workNumber
        else if(newIndex > this.state.workNumber) newIndex = 1
        this.setState({workIndex: newIndex})
        this.showCurrentWork(this.props.r_sorted_workIds[newIndex - 1])
        browserHistory.push('/app/projects/' + this.state.project_id + '/works/' + newIndex)
    }

    onTypeDescription(e){
        this.setState({description: e.target.value})
    }

    onSaveWorkDetails(e) {
		e.preventDefault();
        console.log('Updated file name: ', this.ref_filename.value)
        console.log('Updated description:', this.ref_description.value)
        const {file} = this.state
        file['name'] = this.ref_filename.value
        file['description'] = this.ref_description.value
        this.props.updateWorkDetails(file, (res) => {

        })
    }

    onClickFeedbackIcon(icon) {
        console.log(icon)
        if(this.state.fbState === icon){
            this.setState({isFBMaking: !this.state.isFBMaking})
        }
        else{
            this.setState({isFBMaking: true, fbState: icon})
        }
    }

    onClickEditIcon(icon) {
        if(this.state.iconState === icon){
            this.setState({isDrawing: !this.state.isDrawing, iconState: ''})
        }
        else if(!this.state.isDrawing){
            this.setState({isDrawing: true, iconState: icon});
        }
        else{
			this.setState({iconState: icon});
        }
        if(this.state.iconState == 'Text'){

            var canvas = new fabric.Canvas('c');
            canvas.setBackgroundImage('', canvas.renderAll.bind(canvas));
            canvas.setHeight(1000);
            canvas.setWidth(1000);

            canvas.add(new fabric.IText('Tap and Type', { 
                left: 50,
                top: 100,
                fontFamily: 'arial black',
                fill: '#333',
                fontSize: 50
            }));
        }

        else if(this.state.iconState =='Shape'){    
            var canvas = new fabric.Canvas('c');
                canvas.setHeight(1000);
                canvas.setWidth(1000);

            var rect = new fabric.Rect({
                left: 40,
                top: 40,
                width: 50,
                height: 50,      
                fill: 'transparent',
                stroke: 'green',
                strokeWidth: 5,
                          });  
            canvas.add(rect);
        }
    }
   
    
    onAddComment(event) {
		event.preventDefault()
        let fbArray = this.state.fbArray
        const newfb = {
            type: 'text',
            comment: this.state.comment
        }
        fbArray.push(newfb)
        this.setState({fbArray, comment: ''})
    }

    handleChangeFile (event) {
        console.log('Selected file:', event.target.files[0]);
        this.onDrop(event.target.files)
    }

    onDrop(files, event){
        const _this = this
        let fbArray = this.state.fbArray
        for(let index = 0; index < files.length; index++){
            const fileType = files[index].type
            console.log('File type is ', fileType)
            let newfb = {}
            if(fileType.indexOf('image') > -1){
                let selectedFile = files[index];
                alert(JSON.stringify(files[index].mozFullPath))
                let reader = new FileReader();
                reader.onload = function(event) {
                    _this.setState({avatarURL: event.target.result});
                    newfb = {
                        type: 'image',
                        image: event.target.result,
                        file: files[index],
                        name: files[index].name,
                    }
                    fbArray.push(newfb)
                    _this.setState({fbArray})
                };
                reader.readAsDataURL(selectedFile);
            }
            else{

                newfb = {
                    type: 'other',
                    name: files[index].name,
                    ext: fileType,
                    file: files[index],
                }
                fbArray.push(newfb)
            }
        }
        this.setState({fbArray})
    }

    onCompleteUpload() {
        if(this.state.n_upload === this.state.t_upload){
            //console.log('Completed uploading, started updating database')
            this.props.addComment(this.state.project, this.state.file, this.state.fbArray, (res) => {
                this.setState({fbState: '', fbArray: [], isUploading: false})
            })
        }
    }

    onPreviewImage(url) {
        this.setState({previewImageURL: url, isPreviewImage: true})
    }

    onSendFeedback() {
        const _this = this
        let t_upload = 0
        this.state.fbArray.map(function(feedback, index){
            if(feedback.type !== 'text'){
                t_upload += 1
                let UploadTask = firebase.storage().ref('files/' + controller.myEncode(feedback.name)).put(feedback.file)
                UploadTask.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('uploading progress-' + index)
                    document.getElementById('progress-' + index).style.width = progress + '%'
                    console.log('Upload is ' + progress + '% done');
                }, function(error) {
                    // Handle unsuccessful uploads
                }, function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    _this.setState({n_upload: _this.state.n_upload + 1})
                    _this.onCompleteUpload()
                });
            }
        })
        this.setState({t_upload, n_upload: 0, isUploading: true})
        if(t_upload === 0) this.onCompleteUpload()
    }

    onDeleteComment(key) {
        this.setState({isDeleteComment: true, deleteKey: key})
    }

    onConfirmDelete(type) {
        switch(type){
            case 'comment':
                this.props.removeComment(this.state.project, this.state.file, this.state.deleteKey)
                break
            case 'reply':
                this.props.removeReply(this.state.file, this.state.deleteReply)
                break
            case 'work':
                this.setState({isDelete: false})
                this.props.deleteWork(this.state.file, this.state.project)
                this.onBackToProjectPage()
                break
            default:
                break
        }
    }

    onCancelDelete(type) {
        switch(type){
            case 'comment':
                this.setState({isDeleteComment: false})
                break
            case 'reply':
                this.setState({isDeleteReply: false})
                break
            case 'work':
                this.setState({isDelete: false})
                break
            default:
                break
        }

    }

    onReplyFeedback(key, text, comment) {
        try{
            const MY_UID = localStorage.getItem('uid')
            const MY_NAME = JSON.parse(localStorage.getItem('user')).name
            this.props.replyComment(MY_UID, MY_NAME, key, text, comment, this.state.file)
        }
        catch(e){
            browserHistory.push('/')
        }
    }

    onDeleteReply(key, comment, replyDate){
        this.setState({
            isDeleteReply: true,
            deleteReply: {
                key,
                comment,
                replyDate
            }
        })
    }

   

    render() {
        const _this = this
        const {file} = this.state
      console.log("ye hai woh", this.state.file.type);
        return (
            <main className="main-work-detail">
                <Notifications />
                {
	                this.state.isPreviewImage?
	                <div className="work-preview-image-view">
	                    <header>Press <span>ESC</span> to exit full screen</header>
                        <button className="icon-close-full" onClick={() => {this.setState({isPreviewImage: false})}}></button>
	                    <img alt="" src={this.state.previewImageURL} className="work-preview-image" />
	                </div>
	                :null
                }

                <header className="main item-header">

                    <button
                    onClick={() => this.onBackToProjectPage()}
                    className="work-back-icon">
                        <i className="icon-back-full"></i>
                            {
                                file.name !== undefined?
                                this.state.workIndex + '/' + this.state.workNumber + ' ' + controller.myDecode(file.name)
                                :null
                            }
                    </button>
                </header>
                {
                    this.state.isDeleteComment?
                    <DeleteForm type='comment' onDelete={() => this.onConfirmDelete('comment')} onCancel={() => this.onCancelDelete('comment')} />
                    :this.state.isDeleteReply?
                    <DeleteForm type='reply' onDelete={() => this.onConfirmDelete('reply')} onCancel={() => this.onCancelDelete('reply')} />
                    :this.state.isDelete?
                    <DeleteForm isProject={false} name={this.state.file.name} onDelete={() => this.onConfirmDelete('work')} onCancel={() => this.onCancelDelete('work')} />

                    :<div id="item-viewer-container" className={this.state.isDrawing ? 'bar-open' : null}>
                        <section className="item-viewer">
                                <div className={this.state.OwnProject === null ? 'item-viewer-inner with-nav' : 'item-viewer-inner with-nav'}>

                                {
                                    // this.state.OwnProject?null:
                                    <div>
                 
										<nav className="item-viewer-nav">
											<ul>
												<li><button data-tooltip="Add Text" className={this.state.iconState === 'Text' ? 'current' : null} onClick={() => this.onClickEditIcon('Text')}><i className="icon-text"></i></button></li>
				                            	<li><button data-tooltip="Add Shapes" className={this.state.iconState === 'Shape' ? 'current' : null} onClick={() => this.onClickEditIcon('Shape')}><i className="icon-shape"></i></button></li>
				                            	<li><button data-tooltip="Draw" className={this.state.iconState === 'Pencil' ? 'current' : null} onClick={() => this.onClickEditIcon('Pencil')}><i className="icon-pencil"></i></button></li>
											</ul>
											<ul>
												<li id="description-toggle">
					                                <a onClick={() => {
					                                    const state = this.state.showDescription
					                                    this.setState({showDescription: !state})
					                                }}>
													Description&nbsp;
					                                    {
					                                        this.state.showDescription?
															<i className="icon-down"></i>
					                                        :
					                                        <i className="icon-up"></i>
					                                    }
					                                </a>
					                                {
					                                    this.state.showDescription?
					                                    <p id="description-container">
					                                        {this.state.file.description === '' || this.state.file.description === undefined ? 'No description' : this.state.file.description}
					                                    </p>
					                                    :null
					                                }
		                            			</li>
												<li className="annotation-state-change button-bar">
													<button data-tooltip="Undo Changes" data-flow="up" type="button" className="icon"><i className="icon-undo"></i></button>
													<button data-tooltip="Redo Changes" data-flow="up" type="button" className="icon"><i className="icon-redo"></i></button>
													<button data-tooltip="Delete Changes" data-flow="up" type="button" className="icon"><i className="icon-trash"></i></button>
												</li>
												<li className="annotation-state-change"><button disabled="" type="button" className="sq">Done With Annotation</button></li>
											</ul>
										</nav>
										<nav id="tab-text-annotation-bar" className={this.state.iconState === 'Text' ? 'text-annotation-bar annotation-content current' : 'text-annotation-bar annotation-content'}>
											<div>
												<div className="select-style" id="font-type-selector">
													<select>
														<option>Proxima Nova</option>
													</select>
												</div>
												<div className="select-style" id="font-size-selector">
													<select>
														<option>16</option>
													</select>
												</div>
												<div className="select-style" id="font-style-selector">
													<select>
														<option>Regular</option>
													</select>
												</div>
												<ul className="font-color-selector">
													<li><button className="bg-black"></button></li>
													<li><button className="bg-purple"></button></li>
													<li><button className="bg-blue"></button></li>
													<li><button className="bg-green"></button></li>
													<li><button className="bg-orange"></button></li>
													<li><button className="bg-red"></button></li>
													<li><button className="bg-white" ></button></li>
												</ul>
											</div>
										</nav>
										<nav id="tab-shape-annotation-bar" className={this.state.iconState === 'Shape' ? 'text-annotation-bar annotation-content current' : 'text-annotation-bar annotation-content'}>
											<div>
												<ul className="shape-selector">
													<li><button><i className="icon-shape"></i></button></li>
													<li><button><i className="icon-circle"></i></button></li>
												</ul>
												<div className="select-style" id="font-size-selector">
													<select>
														<option>16</option>
													</select>
												</div>
												<ul className="font-color-selector">
													<li><button className="bg-black"></button></li>
													<li><button className="bg-purple"></button></li>
													<li><button className="bg-blue"></button></li>
													<li><button className="bg-green"></button></li>
													<li><button className="bg-orange"></button></li>
													<li><button className="bg-red"></button></li>
													<li><button className="bg-white" ></button></li>
												</ul>
											</div>
										</nav>
										<nav id="tab-draw-annotation-bar" className={this.state.iconState === 'Pencil' ? 'text-annotation-bar annotation-content current' : 'text-annotation-bar annotation-content'}>
											<div>
												<div className="select-style" id="font-size-selector">
													<select>
														<option>16</option>
													</select>
												</div>
												<ul className="font-color-selector">
													<li><button className="bg-black"></button></li>
													<li><button className="bg-purple"></button></li>
													<li><button className="bg-blue"></button></li>
													<li><button className="bg-green"></button></li>
													<li><button className="bg-orange"></button></li>
													<li><button className="bg-red"></button></li>
													<li><button className="bg-white"></button></li>
												</ul>
											</div>
										</nav>
									</div>
			                    }

                                {
                                    this.state.isLoading?
                                    <div className="viewer-preloader" style={{backgroundImage: "url(" + loadingIcon + ")" }}></div>
                                    :this.state.file.type === 'VIDEO' || this.state.file.type === "MP4"?
                                    <FirebaseMedia type="video" url={this.state.file.image} handle={this.props}/>
                                    :this.state.file.type === 'AUDIO' || this.state.file.type === "MP3"?
                                    <FirebaseMedia type="audio" url={this.state.file.image} handle={this.props}/>
                                    :this.state.file.type === 'PDF'?
                                    <FirebaseMedia file={this.state.file} type="pdf" url={this.state.file.image} handle={this.props}/>
                                    :
									<div className="full-item">
                                        <canvas id="c"></canvas>
                    {this.state.file.type === "WORD" ? <div className="full-item-inner document-container"><iframe title="Document View" src={this.state.workContent}></iframe></div> : <div className="full-item-inner"><img alt="" src={this.state.workContent} /></div>}
                  					</div>
                                }
                               
                                </div>

                                {
                                    this.props.r_sorted_workIds.length === 1?null
                                    :<button id="item-prev" className="icon-arrow-left" onClick={() => this.onClickNextButton(-1)}></button>
                                }
                                {
                                    this.props.r_sorted_workIds.length === 1?null
                                    :<button id="item-next" className="icon-arrow-right" onClick={() => this.onClickNextButton(1)}></button>
                                }
                        </section>
                        {
                            !this.state.OwnProject?
                            <aside className="annotation-details">
                                <div className="annotation-details-container">
                                <nav className="tabs icons">
                                    <ul>
                                        <li>
                                            <button data-tooltip="Leave a Comment" data-flow="up" className={this.state.fbState === 'Comment' ? "current" : "not-selected" } onClick={() => this.onClickFeedbackIcon('Comment')} >
                                                <i className="icon-comment"></i>
                                            </button>
                                        </li>
                                        <li>
                                            <button data-tooltip="Upload Feedback" data-flow="up" className={this.state.fbState === 'Upload' ? "current" : "not-selected" } onClick={() => this.onClickFeedbackIcon('Upload')}>
                                                <i className="icon-upload"></i>
                                            </button>
                                        </li>
                                        <li>
                                            <button data-tooltip="Record Feedback" data-flow="up" className={this.state.fbState === 'Video' ? "current" : "not-selected" } onClick={() => this.onClickFeedbackIcon('Video')}>
                                                <i className="icon-record"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                                {
                                    this.state.fbState === 'Comment'?
                                    <div className={!this.state.isFBMaking ? "tab-content" : "tab-content current" } >
                                        <form className="reviewer-comment">
                                            <textarea placeholder="Leave a comment..." maxLength={1024} style={{flex: 1}} onChange={(e) => this.setState({comment: e.target.value})} value={this.state.comment} />
                                            <button type="submit" className="sq extra-small" onClick={(event) => this.onAddComment(event)}>Add Comment</button>
                                        </form>
                                    </div>
                                    :this.state.fbState === 'Upload'?
                                    <div id="tab-upload" className={!this.state.isFBMaking ? "tab-content" : "tab-content current" } >
                                        <div>
                                            <div>
                                                <label>
													<FileDrop frame={document} targetAlwaysVisible={false} onDrop={(files, event) => this.onDrop(files, event)}/>
                                                	<input type="file" ref={(ref) => this.fileEvent = ref} onChange={(event) => this.handleChangeFile(event)}/>
                                                	<i className="icon-plus-full"></i>
													<h5>Drag &amp; Drop Files or Browse</h5>
                                                	<p>You can use many different file type for multimedia feedback.</p>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    :this.state.fbState === 'Video'?
                                    <div id="tab-record" className={!this.state.isFBMaking ? "tab-content" : "tab-content current" } >
                                        <div>
                                            <button id="leave-audio-annotation"><i className="icon-microphone"></i> Audio</button>
                                            <button id="leave-video-annotation"><i className="icon-video"></i> Video</button>
                                        </div>
                                    </div>
                                    :null
                                }
                                {
                                    this.state.fbState === ''?
                                    <section className="annotation-list">
                                        {
                                            file.comments === undefined?null
                                            :
                                            <FeedbackList data={file.comments} ownProject={false} handle={_this.props} onDeleteComment={(key) => this.onDeleteComment(key)} onPreviewImage={(url) => this.onPreviewImage(url)}/>
                                        }
                                    </section>
                                    :
                                    <section className={this.state.isFBMaking ? "annotation-list" : "annotation-list open" } >
                                        <ul className="item-list">
                                            {
                                                this.state.fbArray.map(function(feedback, index){
                                                    if(feedback.type === 'image'){
                                                        return(
                                                            <li key={index} className="item send-feedback-image-div">
                                                                <div className="item-image" style={{backgroundImage: "url(" + feedback.image + ")"}}></div>
                                                                <div className="work-feedback-progress" id={"progress-" + index} />
                                                            </li>
                                                        )
                                                    }
                                                    if(feedback.type === 'other'){
                                                        if(feedback.ext.indexOf('audio') > -1){
                                                            return(
                                                                <li key={index} className="item send-feedback-image-div">
                                                                    <video controls className="feedback-video-annotation">
                                                                        <source src={URL.createObjectURL(feedback.file)} type="audio/mp3"></source>
                                                                    </video>
                                                                    <div className="work-feedback-progress" id={"progress-" + index} />
                                                                </li>
                                                            )
                                                        }
                                                        else if(feedback.ext.indexOf('pdf') > -1){
                                                            return(
                                                                <li key={index} className="item send-feedback-image-div">
                                                                    <img alt="" src={sample_pdf} />
                                                                    <div className="work-feedback-progress" id={"progress-" + index} />
                                                                </li>
                                                            )
                                                        }
                                                        else if(feedback.ext.indexOf('office') > -1){
                                                            return(
                                                                <li key={index} className="item send-feedback-image-div">
                                                                    <img alt="" src={sample_word} />
                                                                    <div className="work-feedback-progress" id={"progress-" + index} />
                                                                </li>
                                                            )
                                                        }
                                                        else{
                                                            return(
                                                                <li key={index} className="item send-feedback-image-div">
                                                                    <FirebaseMedia type="pdf" url={this.state.file.image} handle={this.props}/>
                                                                    <div className="work-feedback-progress" id={"progress-" + index} />
                                                                </li>
                                                            )
                                                        }
                                                    }
                                                    else if(feedback.type === 'text'){
                                                        return(
                                                            <li key={index} className="item comment-box">
                                                                <p className="work-feedback-comment">{feedback.comment}</p>
                                                                <div className="work-feedback-progress" id={"progress-" + index} />
                                                            </li>
                                                        )
                                                    }
                                                })
                                            }
                                        </ul>
                                    </section>
                                }
                                {
                                    this.state.fbState === ''?null
                                    :this.state.isUploading?
                                    <section className="annotation-submission">
                                        <div>
                                        <center>Please wait while uploading...</center>
                                        <center>Dont refresh this page.</center>
                                        </div>
                                    </section>
                                    :
                                    <section className="annotation-submission">
                                        <button type="button" className="sq white" onClick={() => this.setState({fbState: ''})}>Save For Later</button>
                                        <button type="button" className="sq" onClick={() => this.onSendFeedback()}>Send Feedback</button>
                                    </section>
                                }
                                </div>
                            </aside>
                            :this.state.OwnProject && this.state.tabState === 'feedback'?
                            <aside className="item-details">
                                <nav className="row tabs pill">
                                    <ul>
                                        <li>
                                            <button className="current" onClick={() => this.setState({tabState: 'feedback'})}>Feedback</button>
                                        </li>
                                        <li>
                                            <button onClick={() => this.setState({tabState: 'editwork'})}>Edit Work</button>
                                        </li>
                                    </ul>
                                </nav>
                                <section className="tab-content current">
                                    {
                                        file.comments === undefined || file.comments.length === 0?
                                        <p className="no-margin">No feedback yet.</p>
                                        :
                                        <div>
                                            {
                                                <FeedbackList
                                                    data={file.comments}
                                                    ownProject={true}
                                                    handle={_this.props}
                                                    onReplyComment={(key, text, comment) => this.onReplyFeedback(key, text, comment)}
                                                    onDeleteReply={(key, comment, replyDate) => this.onDeleteReply(key, comment, replyDate)}
                                                    onPreviewImage={(url) => this.onPreviewImage(url)}
                                                />
                                            }
                                        </div>
                                    }
                                </section>
                            </aside>
                            :this.state.OwnProject?
                            <aside className="item-details">
                                <nav className="row tabs pill">
                                    <ul>
                                        <li>
                                            <button onClick={() => this.setState({tabState: 'feedback'})}>Feedback</button>
                                        </li>
                                        <li>
                                            <button className="current" onClick={() => this.setState({tabState: 'editwork'})}>Edit Work</button>
                                        </li>
                                    </ul>
                                </nav>
                                <section className="tab-content current">

                                    <form className="edit-item">
										<label htmlFor="item-title">Work Title</label>
                                        <input id="item-title" type="text" ref={(ref) => this.ref_filename = ref} onChange={(e) => this.setState({fileName: e.target.value})} value={this.state.fileName}/>
                                        <label htmlFor="item-description">Work Description</label>
										<textarea id="item-description" placeholder="Add a description here..." ref={(ref) => this.ref_description = ref} maxLength={1024} onChange={(e) => this.onTypeDescription(e)} value={this.state.description} />



	                                    <div className="button-columns">
	                                        <button data-tooltip="Delete Work" type="button" className="sq white gray-text" onClick={() => _this.setState({isDelete: true})}>
	                                            <i className="icon-trash"></i>
	                                        </button>
	                                        <button data-tooltip="Download Work" type="button" className="sq white gray-text">
	                                            <i className="icon-download"></i>
	                                        </button>
											<button type="submit" className="sq" onClick={(e) => this.onSaveWorkDetails(e)}>Save Details</button>
	                                    </div>

									</form>

                                </section>

                            </aside>
                            :null
                        }
                    </div>
                }
            </main>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => {
    return {
        r_welcome: state.loginReducer.app_state,
        r_user: state.loginReducer.user,
        r_sorted_workIds: state.projectReducer.sorted_workIds
    }
}, mapDispatchToProps)(WorkItemView);
