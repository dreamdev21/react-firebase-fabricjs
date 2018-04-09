import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as Controller from '../../lib/controller'
import Notifications, {notify} from 'react-notify-toast';
require('./index.css')
 
export default class ShareForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: 'smartwebdev726@gmail.com',
            confirm: false
        }
    }

    static propTypes = {
        onShare: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
    }

    static defaultProps = {
        onShare: () => undefined,
        onClose: () => undefined,
    }

    onClickShare(e) {
		e.preventDefault();
        if(!this.validateEmail(this.state.email)){
            let myColor = { background: '#0E1717', text: "#FFFFFF" };
            notify.show("The email is invalid!", "error", 3000, myColor);
        }
        else{            
            this.sendEmail(this.state.email)            
        }
    }

    sendEmail(email) {
        const user = JSON.parse(localStorage.getItem('user'))
        const link = window.location.href.toString()
        const html = 
        'Hello,<br>' + 
        user.name + ' would like you to give feedback on his project: <a href="' + link + '">' + link + '</a><br>' +
        'Click the link above to sign in and start providing feedback.'
        //send share email
        const param = {
            to: email,
            content: html
        }

        console.log('Sending email...')
        var localFirebaseUrl = 'http://localhost:5000/hopscotch-4a440/us-central1/mailGunFunction';
        var serverFirebaseUrl = 'https://us-central1-hopscotch-4a440.cloudfunctions.net/mailGunFunction';
        fetch(serverFirebaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(param)
        })
        .then((json) => {
            console.log('Share Email Result: ', json)
            if(json.status === 200){
                this.setState({confirm: true})
                this.props.onShare(this.state.email)
            }
        })
        .catch((e) => {
            console.log('Share Email Error: ', e.toString())
        })
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    render() {
        return (
            <div className="medium-width">
                <Notifications />
                {
                    this.state.confirm?
                    <div>
                        <div className="row">
                            <button className="icon-close-full" onClick={() => {this.props.onClose()}}></button>
                        </div>
                        <div className="medium-width">	
							<form id="share-project" className="minimal-form">
			  					<fieldset>
                                    <center className="share-title">Email Sent!</center>
                                    <center className="delete-message">Your project link has been successfully sent to {this.state.email}.</center>
                                    <center className="delete-message">You will be notified when feedback is received.</center>
                                </fieldset>
                                <div className="share-button-view">
                                    <span><button className="share-button-more" onClick={() => this.setState({confirm: false})}>SHARE MORE?</button></span>
                                    <span><button className="share-button-done" onClick={() => this.props.onClose()}>IM DONE!</button></span>
                                </div>
							</form>		
						</div>
                    </div>
                    :
                    <div>
                        <div className="row">
                            <button className="icon-close-full" onClick={() => {this.props.onClose()}}></button>
                        </div>
						<div className="medium-width">	
							<form id="share-project" className="minimal-form">
			  					<fieldset>
									<legend>You can share with people who you would like to review your work.</legend>
				  					<p>
	                            		<input 
		                                type="text" 
		                                placeholder="Add Email Address"
		                                onChange={(e) => this.setState({email: e.target.value})} />
							    	</p>
									<p>
										<button type="submit" onClick={(e) => this.onClickShare(e)}>Share Now</button>
									</p>
							 	</fieldset>
							</form>		
						</div>
                    </div>
                }
            </div>
        );
    }
}