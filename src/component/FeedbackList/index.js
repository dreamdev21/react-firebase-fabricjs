import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as Controller from '../../lib/controller'
import ProfileImage from '../ProfileImage'
import FeedbackImage from './image'
import FirebaseMedia from './media'
import Notifications, {notify} from 'react-notify-toast';
import { Document, Page } from 'react-pdf';
const sample_word = require('../../resource/images/sample-word.png')
const sample_pdf = require('../../resource/images/sample-pdf.png')
require('./index.css')

export default class FeedbackList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            replyText: ''
        }
    }

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
    }

    static propTypes = {
        data: PropTypes.object.isRequired,
        handle: PropTypes.object.isRequired,
        ownProject: PropTypes.bool.isRequired,
        onPreviewImage: PropTypes.func,
        onDeleteComment: PropTypes.func,
        onReplyComment: PropTypes.func,
        onDeleteReply: PropTypes.func
    }

    static defaultProps = {
        onPreviewImage: () => undefined,
        onDeleteComment: () => undefined,
        onReplyComment: () => undefined,
        onDeleteReply: () => undefined
    }

    onDeleteComment(key) {
        console.log('delete comment ', key)
        this.props.onDeleteComment(key)
    }

    onReplyComment(key) {
        console.log('reply comment ', key)
        if(this.state.replayKey === key) this.setState({replayKey: ''})
        else this.setState({replayKey: key})
    }

    onTypeReply(e){
        this.setState({replyText: e.target.value})
        e.target.style.cssText = 'height:auto; padding:15';
        e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';
    }

    onReplyConfirm(e, key, comment){
		e.preventDefault();
        if(this.state.replyText === ''){
            
        }
        else{
            this.props.onReplyComment(key, this.state.replyText, comment)
        }        
    }

    render() {
        const _this = this
        const {data, handle} = this.props
        const MY_UID = localStorage.getItem('uid')
        return (
            <ul className="feedback-list">
                {
                    Object.keys(data).map(function(key, index){
                        const CMT = data[key]
                        const ANT = JSON.parse(data[key].annotation)
                        return(
                            <li key={index}>
                                <ProfileImage id={CMT.user_id} handle={handle} />
                                <p className="reviewer-name truncate"><strong>{CMT.user_id === MY_UID ? 'You' : CMT.user_name}</strong></p>
                                <p className="review-date truncate">{Controller.convertTimeStamp(CMT.date)}</p>
                                {
                                    CMT.user_id === MY_UID?
                                    <a className="user-feedback-delete" id={"delete-" + index} onClick={() => _this.onDeleteComment(key)}>Delete</a>
                                    :_this.props.ownProject?
                                    <a className="user-feedback-delete" id={"reply-" + index} onClick={() => _this.onReplyComment(key)}>Reply</a>
                                    :null
                                }
                                <ul className="item-list">  
                                {
                                    ANT.map(function(annotation, index){
                                        switch(annotation.type){
                                            case 'text':
                                                return(
                                                    <li key={index} className="item feedback annotation-link"><p className="user-feedback-comment">{annotation.text}</p></li>
                                                )
                                            case 'image':
                                                return(
                                                    <li key={index} className="item"><FeedbackImage key={index} url={annotation.url} handle={_this.props.handle} onPreviewImage={(url) => _this.props.onPreviewImage(url)}/></li>
                                                )
                                            case 'other':
                                                if(annotation.ext.indexOf('audio') > -1){
                                                    return(
                                                        <li key={index} className="item">
                                                            <FirebaseMedia type='audio' url={annotation.url} handle={_this.props.handle} />
                                                        </li>
                                                    )
                                                }
                                                else if(annotation.ext.indexOf('pdf') > -1){
                                                    return(
                                                        <li key={index} className="item">
                                                            <img alt="" src={sample_pdf} />
                                                        </li>
                                                    )
                                                }
                                                if(annotation.ext.indexOf('office') > -1){
                                                    return(
                                                        <li key={index} className="item">
                                                            <img alt="" src={sample_word} />
                                                        </li>
                                                    )
                                                }
                                                return(
                                                    <li key={index} className="item">
                                                        <FirebaseMedia type="video" url={annotation.url} handle={_this.props.handle} />
                                                    </li>
                                                )
                                            default:
                                                return 'Coming soon'
                                        }
                                    })
                                }
								
                                {
                                    CMT.reply !== undefined?
                                        JSON.parse(CMT.reply).map(function(reply, index){
                                            let name = reply.user_name
                                            if(reply.user_id === MY_UID) name = 'You'
                                            return(
                                                <li key={index} className="item feedback feedback-replied">
                                                    <i className="icon-reply"></i>
                                                    <p className="reviewer-name truncate"><strong>{name}</strong></p>
                                                    <p className="review-date truncate">{Controller.convertTimeStamp(reply.date)}</p>
                                                    {
                                                        reply.user_id === MY_UID?
                                                        <a className="feedback-delete" onClick={() => _this.props.onDeleteReply(key, data[key], reply.date)}>Delete</a>
                                                        :null
                                                    }                                                    
                                                    <p className="reply-text">{reply.text}</p>
                                                </li>      
                                            )                                  
                                        })
                                    :null                                    
                                }
								</ul>
                                {
                                    _this.state.replayKey === key?
                                    <form className="reply-form">
                                        <textarea className="feedback-reply-textarea" maxLength={1024} onChange={(e) => _this.onTypeReply(e)} value={_this.state.replyText}/>
                                        <div>
                                            <button className="close-reply-form" onClick={() => _this.setState({replayKey: ''})}>Cancel</button>
                                            {
                                                _this.state.replyText.length > 0 ?
                                                <button className="sq small" type="submit" onClick={(e) => _this.onReplyConfirm(e, key, data[key])}>Reply</button>
                                                :  
												<button disabled className="sq small" type="submit">Reply</button>
                                            }     
											                 
                                        </div>
                                    </form>
                                    :null
                                }
                            </li>
                        )
                    })
                }
            </ul>
        );
    }
}