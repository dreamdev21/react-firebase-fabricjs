import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../redux/action'
import Header from '../../component/Header'
import Notifications, {notify} from 'react-notify-toast';
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import ActivityItem from './activityItem'
require('./index.css')
const loadingIcon = require('../../resource/gif/loading.svg')

class Activity extends Component {

    constructor(props) {
        super(props)
        this.state = {
            RA: {},
            LA: {},
            Loaded: false,
            tabState: 'Received'
        }
    }

    componentDidMount() {
        try{
            const userData = localStorage.getItem('user')
            const checkName = userData.name
            const MY_UID = localStorage.getItem('uid')
            this.props.getActivity('Receive', MY_UID, (data) => {
                console.log('Received activity: ', data)
                this.setState({RA: data, Loaded: true})
            })
            this.props.getActivity('Left', MY_UID, (data) => {
                console.log('Left Activity: ', data)
                this.setState({LA: data, Loaded: true})
            })
        }
        catch(e){
            browserHistory.push('/')
            return
        }

        this.pDate = 0
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

    getPDate(key) {
        const result = this.pDate;
        this.pDate = key;
        return parseInt(result, 10)
    }

    onPreviewImage(url) {
        this.setState({previewImageURL: url, isPreviewImage: true})
    }

    onClickActivityTap(tabTitle) {
        this.setState({tabState: tabTitle})
    }
    
    render() {
        const _this = this 
        this.pDate = 0
        return (
            <main>
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
                <Header onSignOut={() => this.props.signOut()} tabState='Activity'/>
				<div className="medium-width authenticated header-container">
					<header className="settings">
						<nav>
							<ul>
								<li>
                                    <button
                                        style={{color: this.state.tabState === 'Received' ? '#373D47' : '#898E96'}}
                                        onClick={() => this.onClickActivityTap('Received')}>
                                        Feedback Received
                                    </button>
                                </li>
								<li>
                                    <button
                                        style={{color: this.state.tabState === 'Left' ? '#373D47' : '#898E96'}}
                                        onClick={() => this.onClickActivityTap('Left')}>
                                        Feedback Left
                                    </button>
                                </li>
							</ul>
						</nav>
					</header>
				</div>
                {
                    this.state.tabState === 'Received'?
                    <div className="medium-width authenticated contained">
						<ul className="feedback-list">
                        {
                            !this.state.Loaded?
                            <div className="loading-icon-container"><img className="loading-icon" alt="" src={loadingIcon} width={50} height={50} /></div>
                            :Object.keys(this.state.RA).length === 0?
                            <div className="activity-empty-text">No received activities</div>
                            :
                            Object.keys(this.state.RA).map(function(key, index){                                
                                return(
                                    
									<ActivityItem 
	                                        key={key} 
	                                        date={Number(key)} 
	                                        activity={_this.state.RA[key]} 
	                                        pDate={_this.getPDate(key)} 
	                                        isLeft={false} 
	                                        handle={_this.props}
	                                        onPreviewImage={(url) => _this.onPreviewImage(url)}
	                                    />
									
                                )                                
                            })
                        }
						</ul>
                    </div>  
                    :
                    <div className="medium-width authenticated contained">
						<ul className="feedback-list">
                        {
                            !this.state.Loaded?
                            <div className="loading-icon-container"><img className="loading-icon" alt="" src={loadingIcon} width={50} height={50} /></div>
                            :Object.keys(this.state.LA).length === 0?
                            <div className="activity-empty-text">No left activities</div>
                            :
                            Object.keys(this.state.LA).map(function(key, index){                                
                                return(
										<ActivityItem 
	                                        key={key} 
	                                        date={Number(key)} 
	                                        activity={_this.state.LA[key]} 
	                                        pDate={_this.getPDate(key)} 
	                                        isLeft={true} 
	                                        handle={_this.props}
	                                        onPreviewImage={(url) => _this.onPreviewImage(url)}
	                                    />
                                )                                
                            })
                        }
						</ul>
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
        r_user: state.loginReducer.user
    }
}, mapDispatchToProps)(Activity);