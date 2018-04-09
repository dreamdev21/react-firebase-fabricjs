import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../redux/action'
import Header from '../../component/Header'
import Notifications, {notify} from 'react-notify-toast';
import firebase from 'firebase'
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';


require('./index.css')
const default_profile = require('../../resource/images/person.png')

class MyAccount extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabState: '',
            notification: null,
            avatarURL: default_profile,
            name: '',
            email: '',
            password: '',
            user: {},
            imageData: null
        }
    }

    componentWillMount(){
        try{
            const userData = localStorage.getItem('user')
            const checkName = userData.name
            const MYUID = localStorage.getItem('uid')
            this.props.getUserDetails(MYUID, (user) => {
                console.log('Profile Data', user)
                this.setState({
                    tabState: 'MyAccount',
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    notification: user.notification,
                    avatarURL: user.photo,
                    user,
                })
            })
        }
        catch(e){
            browserHistory.push('/')
            return
        }
    }

    componentDidMount() {
        
        
    }

    onDisableNotification() {
        this.props.setUserNotification(this.state.user, false, (res) => {
            if(res === 'success') this.setState({notification: false})
            else {
                let myColor = { background: '#0E1717', text: "#FFFFFF" };
                notify.show("Server Error!", "error", 3000, myColor);
                return
            }
        })
    }

    onEnableNotification() {
        this.props.setUserNotification(this.state.user, true, (res) => {
            if(res === 'success') this.setState({notification: true})
            else {
                let myColor = { background: '#0E1717', text: "#FFFFFF" };
                notify.show("Server Error!", "error", 3000, myColor);
                return
            }
        })
    }

    onConnect(social) {
        switch(social){
            case 'Dropbox':

                break;
            case 'Google Drive':

                break;
            case 'box':

                break;
            default:
        }
    }

    onChangePhoto(event) {
        const _this = this
        const ValidTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/JPG', 'image/PNG', 'image/JPEG']
        if(ValidTypes.indexOf(event.target.files[0].type) < 0){
            let myColor = { background: '#0E1717', text: "#FFFFFF" };
            notify.show("Invalid file type!", "error", 3000, myColor);
            return
        }
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function(event) {
            _this.setState({avatarURL: event.target.result});
        };
        reader.readAsDataURL(selectedFile);
        this.setState({imageData: selectedFile})
    }

    onSaveProfile(e) {
		e.preventDefault();
        const _this = this
        if(this.state.imageData !==null){
            const avatarURL = 'profile/' + localStorage.getItem('uid')
            let UploadTask = firebase.storage().ref(avatarURL).put(this.state.imageData)
            UploadTask.on('state_changed', function(snapshot){
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                _this.mounted && _this.setState({percent: progress})
                console.log('Upload is ' + progress + '% done');
            }, function(error) {
                // Handle unsuccessful uploads
            }, function() {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                var downloadURL = UploadTask.snapshot.downloadURL;
                let user = _this.state.user
                user['name'] = _this.state.name
                user['photo'] = downloadURL
                _this.props.updateProfile(user, (res) => {
                    let myColor = { background: 'green', text: "#FFFFFF" };
                    notify.show("Your profile has been saved!", "custom", 3000, myColor);
                    return
                })
            });    
        }
        else if(this.state.name !== this.state.user.name){
            let user = _this.state.user
            user['name'] = _this.state.name
            this.props.updateProfile(user, (res) => {
                let myColor = { background: 'green', text: "#FFFFFF" };
                notify.show("Your profile has been saved!", "custom", 3000, myColor);
                return
            })
        }
    }
    
    render() {
        return (
            <main>
                <Notifications />
                <Header onSignOut={() => this.props.signOut()} tabState='Username'/>
                <div className="medium-width authenticated header-container">
                    <header className="settings">
						<nav>
							<ul>
								<li>
		                        	<button 
			                            className={this.state.tabState === 'MyAccount' ? "current" : "" }
			                            onClick={() => this.setState({tabState: 'MyAccount'})}>
			                            My Account
			                        </button>
								</li>
								<li>
		                        	<button 
										className={this.state.tabState === 'Sync' ? "current" : "" }
			                            onClick={() => this.setState({tabState: 'Sync'})}>
			                            Sync
			                        </button>
								</li>
							</ul>
						</nav>
                    </header>
				</div>
                    {
                        this.state.tabState === 'MyAccount'?
                        <div>
							<div className="medium-width authenticated contained two-column">
								<form id="my-account-settings">
					 	   			<fieldset>
	                                    <p>
	                                        <label>Name</label>
	                                        <input type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
	                                    </p>
	                                    <p>
	                                        <label>Email</label>
	                                        <input type="text" disabled={true} value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>
	                                    </p>
	                                    {
	                                        this.state.user.social === 1?null
	                                        :
	                                        <p>
	                                            <label>Password</label>
	                                            <input type="text" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
	                                        </p>
	                                    }
	                                    <button className="profile-save-button" onClick={(e) => this.onSaveProfile(e)}>Save Details</button>
                                    
	                                </fieldset>
	                          </form>
							
							  <form id="update-profile-image">
									<div className="profile-photo" style={{backgroundImage: "url(" + this.state.avatarURL + ")"}}></div>
                                    <label>
                                        <input type="file" ref={(ref) => this.fileEvent = ref} onChange={(event) => this.onChangePhoto(event)}/>
                                        <div className="profile-image-button">Choose Image</div>
                                    </label>  
								</form>
							</div>
									
									
	                            <div className="medium-width authenticated contained">
										
									<form id="my-notifications">
										<fieldset>
											<legend>Notifications</legend>
											<p className="checkbox-container">
												<label htmlFor="input_notifications">Please send me notifications for new annotations and comments on all projects</label>
												<span>
	                                        		{
			                                            this.state.notification?
														<input onClick={() => this.onDisableNotification()} type="checkbox" value="None" id="send-notifications" name="check" defaultChecked={this.state.notification} />
			                                            :this.state.notification === false?
														<input onClick={() => this.onEnableNotification()} type="checkbox" value="None" id="send-notifications" name="check" />
			                                            :null
			                                        }
													<label htmlFor="send-notifications"></label>
												</span>
											</p>
										</fieldset>
									</form>
	                            </div>
	                        </div>
													
	                        :this.state.tabState === 'Sync'?
													
							<div className="medium-width authenticated contained">
								<h2>Sync</h2>
								<ul id="import-options">
							   		<li id="import-dropbox">
										<i className="icon-dropbox"></i>
										<h3>Dropbox</h3>
										<p>Connect with your Dropbox account to upload source files.</p>
										<button onClick={() => this.onConnect('Dropbox')} id="connect-to-dropbox" type="button" className="sq">Connect</button>
									</li>
									<li id="import-drive">
									    <i className="icon-google-drive"></i>
										<h3>Google Drive</h3>
										<p>Connect with your Google Drive account to upload source files.</p>
										<button onClick={() => this.onConnect('Google Drive')} id="connect-to-dropbox" type="button" className="sq">Connect</button>
									</li>
									<li id="import-box">
									    <i className="icon-box"></i>
										<h3>Box</h3>
										<p>Connect with your Box account to upload source files.</p>
										<button onClick={() => this.onConnect('box')} id="connect-to-dropbox" type="button" className="sq">Connect</button>
									</li>
								</ul>
							</div>	
                        :null
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
        r_user: state.loginReducer.user
    }
}, mapDispatchToProps)(MyAccount);