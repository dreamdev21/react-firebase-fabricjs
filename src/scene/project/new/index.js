import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../../redux/action'
import Header from '../../../component/Header'
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import * as controller from '../../../lib/controller'
require('./index.css')

class FirstProject extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isFirst: false,
            name: '',
            border: null
        }
    }

    onClose() {
        browserHistory.push('/app/projects/all');
    }

    onNewProject(e) { 
		e.preventDefault();       
        if(this.state.name === ''){
            this.setState({border: 'red'})
            return
        }
        const CT = new Date().getTime()
        const UID = localStorage.getItem('uid');
        const id = controller.makeProjectID(UID, CT)
        let project = {
            name: this.state.name,
            worknumber: 0,
            feedback: 0,
            workIds: [],
            project_id: id,
            updated_at: CT,
            uid: UID
        }
        this.props.createProject(project, (res) => {
            console.log('Project created successfully!')
            browserHistory.push('/app/projects/' + id);
        })        
    }

    onChangeText(e) {
        if(e.target.value.length === 0) this.setState({name: e.target.value, border: 'red'})
        else this.setState({name: e.target.value, border: null})
    }

    render() {
        return (
            <main>
                <Header onSignOut={() => this.props.signOut()}/>
                <div style={{position: 'relative'}}>
                    <div className="row">
                        <button className="icon-close-full" onClick={() => browserHistory.push('/app/projects/all')}></button>
                    </div>
                    <div className="medium-width">
                        <form id="create-project" className="minimal-form">
                            <fieldset>
                                    {
                                        this.state.isFirst?
                                        <legend>Welcome to Hopscotch!<br/>Create Your First Project Now</legend>
                                        :<legend>Name Your New Project</legend>
                                    } 
                                <p>
                                    <input 
                                        className="projectInputBox" 
                                        type="text" 
                                        placeholder="Add Project Name"
                                        onChange={(e) => this.onChangeText(e)}
                                        style={{borderBottomColor: this.state.border}}
                                        ref={(ref) => this.projectName = ref}/>
                                </p>
                                <p>
                                    <button type="submit" onClick={(e) => this.onNewProject(e)}>Done</button>
                                </p>
                            </fieldset>
                        </form>
                    </div>
                </div>
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
        r_user: state.loginReducer.user
    }
}, mapDispatchToProps)(FirstProject);