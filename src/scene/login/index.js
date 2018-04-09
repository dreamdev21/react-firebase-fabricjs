import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as firebase from "firebase";
import { ActionCreators } from '../../redux/action'
import InputText from '../../component/InputText'
import Spinner from 'react-spin';
import Notifications, {notify} from 'react-notify-toast';
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

require('./index.css')

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabState: 'login',
            errorState: '',
            email: '',
            password: '',
            confirm: '',
            reset: '',
            isLoading: false
        }
    }

    componentDidMount() {
    }

    onClickTabButton(e) {
		e.preventDefault();
        const title = e.target.value
        if(title === 'Log in'){
            this.setState({tabState: 'login'})
        }
        else{
            this.setState({tabState: 'signup'})
        }
    }

    signUpwithEmailPassword(e) {
		e.preventDefault();
        const {email, password, confirm} = this.state
        if(this.state.isLoading) return
        else if(email === ''){
            this.setState({errorState: 'email'})
            return
        }
        else if(password === ''){
            this.setState({errorState: 'password'})
            return
        }
        else if(password !== confirm){
            alert('Confirm password is incorrect!')
            return
        }
        this.setState({errorState: '', isLoading: true})
        this.props.registerUser({email, password}, (res) => {
            if(res === 'success'){
                this.alertSuccess()
            } 
            else {
                this.alertFailed(res)
                this.setState({isLoading: false})
            }
        })

    }

    signInwithEmailPassword(e) {
		e.preventDefault();
        const {email, password} = this.state
        if(this.state.isLoading) return
        else if(email === ''){
            this.setState({errorState: 'email'})
            return
        }
        else if(password === ''){
            this.setState({errorState: 'password'})
            return
        }
        this.setState({errorState: '', isLoading: true})
        this.props.loginUser({email, password}, (res) => {
            if(res === 'success'){
                this.alertSuccess()
            } 
            else {
                this.alertFailed(res)
                this.setState({isLoading: false})
            }
        })
    }

    resetPassword(e) {
		e.preventDefault();
        if(this.state.isLoading) return
        else if(this.state.reset === ''){
            this.setState({errorState: 'reset'})
            return
        }
        this.setState({errorState: '', isLoading: true})
        this.props.resetPassword(this.state.reset, (res) => {
            this.setState({isLoading: false})
            if(res === 'success'){
                let myColor = { background: 'green', text: "#FFFFFF" };
                notify.show('Reset Email has been sent successfully. Please check your email.', "custom", 5000, myColor);
            }
            else{
                this.alertFailed(res)
            } 
        })
    }

    loginWithProvider(provider) {
        this.props.loginWithProvider(provider, (res) => {
            this.alertSuccess()
        })
    }

    signUpWithProvider(provider) {
        this.props.loginWithProvider(provider, (res) => {
            this.alertSuccess()
        })
    }

    forgotPassword() {
        this.setState({tabState: 'forgot'})
    }

    backToLogin() {
        this.setState({tabState: 'login'})
    }

    alertSuccess() {
        this.props.a_welcome(true)
        browserHistory.push('/app/projects/all');
    }

    alertFailed(error) {
        let myColor = { background: '#0E1717', text: "#FFFFFF" };
        notify.show(error, "error", 5000, myColor);
    }


    render() {
        const _this = this
        const {tabState} = this.state
        return (
            <div id="container" className="vertical-align">
	            <main className="narrow">
					<Notifications />       
					<header className="unauthenticated">
						<button id="logo">Hopscotch.</button>
					</header>      
	                <div className="row">                     
	                        <div className="contained">
	                            <form className="unauthenticated-user-form">
	                                <nav className="row" id="login-nav">                            
	                                    <div className="col-xs-6">
	                                        <button 
	                                            className={tabState === 'signup' ? "tab-button-selected" : "tab-button" }
	                                            ref={(ref) => this.signupButton = ref}
	                                            onClick={(e) => this.onClickTabButton(e)} 
	                                            value="Sign up"
												type="button">
	                                            Sign up
	                                        </button>   
	                                    </div>
	                                    <div className="col-xs-6">
	                                        <button 
	                                            className={tabState === 'login' ? "tab-button-selected" : "tab-button" }
	                                            ref={(ref) => this.loginButton = ref}
	                                            onClick={(e) => this.onClickTabButton(e)} 
	                                            value="Log in"
												type="button">
	                                            Log in
	                                        </button>                             
	                                    </div>               
	                                </nav>
	                                {
	                                    this.state.tabState === 'login'?
	                                    <fieldset className="row">
	                                        <div>
	                                            <legend>Log Into Your Account</legend>
	                                            <p>Hopscotch is the ultimate feedback engine providing seemless collaboration.</p>
	                                            <InputText 
	                                                placeholder="username / email" 
													name="username"
													type="text"
	                                                isError={this.state.errorState === 'email'} 
	                                                errorText="Please enter your email address"
	                                                onChange={(text) => this.setState({email: text})}/>
	                                            <InputText 
	                                                placeholder="password" 
													type="password"
													name="password"
	                                                isError={this.state.errorState === 'password'} 
	                                                errorText="Please enter your password"
	                                                onChange={(text) => this.setState({password: text})}/>
	                                            <button type="submit" className="loginButton" onClick={(e) => this.signInwithEmailPassword(e)}>
	                                                Log In
	                                                {
	                                                    this.state.isLoading?
	                                                    <div className="spinnerView">
	                                                        <Spinner config={{width: 1, radius: 8, color: 'white'}} />
	                                                    </div>
	                                                    :null
	                                                }                                    
	                                            </button>
	                                            <p className="center-content"><a onClick={() => this.forgotPassword()}>Forgot Password?</a></p>
	                                            <hr/>
	                                            <p className="socialTitle">or log in using Facebook, Twitter, or Google</p>
	                                            <div className="row">
	                                                <div className="col-xs-4">
	                                                    <button type="button" className="social facebook" onClick={() => this.loginWithProvider('facebook')} style={{backgroundColor: '#3B5998'}}>
	                                                        <i className="icon-facebook"></i>
	                                                    </button>                                    
	                                                </div>
	                                                <div className="col-xs-4">
	                                                    <button type="button" className="social twitter" onClick={() => this.loginWithProvider('twitter')} style={{backgroundColor: '#1DA1F2'}} onClick={() => alert('twitter')}>
	                                                       <i className="icon-twitter"></i>
	                                                    </button>
	                                                </div>
	                                                <div className="col-xs-4">
		                                                <button type="button" className="social google" onClick={() => this.loginWithProvider('google')} style={{backgroundColor: '#FFF'}}>
		                                                        <i></i>
		                                                </button>
	                                                </div>
	                                            </div>
	                                        </div>
	                                    </fieldset>
	                                    :this.state.tabState === 'signup'?
	                                    <fieldset className="row">
	                                        <div>
	                                            <legend>Create Your Hopscotch Account</legend>
	                                            <p>Hopscotch is the ultimate feedback engine providing seemless collaboration.</p>
	                                            <InputText 
	                                                placeholder="email" 
	                                                isError={this.state.errorState === 'email'} 
	                                                errorText="Please enter your email address"
													type="text"
													name="username"
	                                                onChange={(text) => this.setState({email: text})}/>
	                                            <InputText 
	                                                placeholder="password" 
													name="password"
													type="password"
	                                                isError={this.state.errorState === 'password'} 
	                                                errorText="Please enter your password"
	                                                onChange={(text) => this.setState({password: text})}/>
	                                            <InputText 
	                                                placeholder="confirm password" 
													name="confirm-password"
													type="password"
	                                                isError={this.state.errorState === 'confirm'} 
	                                                errorText="Please enter your confirm password"
	                                                onChange={(text) => this.setState({confirm: text})}/>
	                                            <button type="submit" className="loginButton" onClick={(e) => this.signUpwithEmailPassword(e)}>Sign Up</button>
	                                            <p>By clicking Sign Up, you agree to our <a href="https://hopscotch.co/terms">Terms</a> and have read our <a href="https://hopscotch.co/privacy">Privacy Policy</a></p>
	                                            <hr/>
	                                            <p className="socialTitle">or sign up using Facebook, Twitter, or Google</p>
	                                            <div className="row">
	                                                <div className="col-xs-4">
	                                                    <button type="button" className="social facebook" onClick={() => this.signUpWithProvider('facebook')} style={{backgroundColor: '#3B5998'}}>
	                                                        <i className="icon-facebook"></i>
	                                                </button>                                    
	                                                </div>
	                                                <div className="col-xs-4">
	                                                <button type="button" className="social twitter" onClick={() => this.signUpWithProvider('twitter')} style={{backgroundColor: '#1DA1F2'}} onClick={() => alert('twitter')}>
	                                                        <i className="icon-twitter"></i>
	                                                </button>
	                                                </div>
	                                                <div className="col-xs-4">
	                                                <button type="button" className="social google" onClick={() => this.signUpWithProvider('google')} style={{backgroundColor: '#FFF'}}>
	                                                        <i></i>
	                                                    </button>
	                                                </div>
	                                            </div>
	                                        </div>
	                                    </fieldset>
	                                    :
	                                    <fieldset className="row">
	                                        <div>
	                                            <legend>Log Into Your Account</legend>
	                                            <p>Enter your email address below and we'll get you back on track</p>
	                                            <InputText placeholder="email" 
	                                                isError={this.state.errorState === 'reset'} 
	                                                errorText="Please enter your email address"
	                                                onChange={(text) => this.setState({reset: text})} />
	                                            <button className="loginButton" onClick={(e) => this.resetPassword(e)}>Reset password</button>
	                                            <p className="center-content"><a className="forgotPassword" onClick={() => this.backToLogin()}>Back to login</a></p>
	                                        </div>
	                                    </fieldset>
	                                }
	                            </form>
	                        </div>
	                </div>
	            </main>
			</div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => { 
    return {
        r_user: state.user
    }
}, mapDispatchToProps)(Login);