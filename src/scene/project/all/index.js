import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../../redux/action'
import Header from '../../../component/Header'
import ProjectItem from '../../../component/ProjectItem'
import DeleteForm from '../../../component/Delete'
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Notifications, {notify} from 'react-notify-toast';
import Loading from 'react-loading-bar'
require('./index.css')


class AllProjects extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isDelete: false,
            sortTitle: 'Date Added',
            projects: [],
            Sortable: false,
            tabState: 'My Projects'
        }
    }

    componentDidMount() {
        const _this = this
        this.mounted = true

        try{
            const user = JSON.parse(localStorage.getItem('user'))
            const checkEmail = user.email
        }
        catch(e){
            browserHistory.push('/')
            return
        }

        this.initProjects(this.state.tabState)
        setTimeout(function() {
            if(_this.props.r_welcome) {
                _this.onToast('Welcome to Hopscotch!')
                _this.props.a_welcome(false)
            }
        }, 1000)        
    }

    onToast(msg) {
        let myColor = { background: 'green', text: "#FFFFFF" };
        notify.show(msg, "custom", 5000, myColor);
    }

    initProjects(tabState) {
        const _this = this
        this.mounted && this.setState({isLoading: true, loadNumber: 0,projects: []})
        if(tabState === 'My Projects'){
            this.props.getMyProjects((data) => {
                console.log('My Projects', data.project_ids)
                if(data.project_ids === undefined){
                    this.mounted && this.setState({projects: []})
                }
                else{
                    let temp = JSON.parse(data.project_ids)
                    let projects = []
                    temp.map(function(id, index){
                        projects.push({
                            project_id: id
                        })
                    })
                    this.mounted && this.setState({projects})
                }
                this.mounted && this.setState({isLoading: false})                
            })
        }
        else{
            this.props.getSharedProjects((data) => {
                console.log('Shared Projects', data.project_ids)
                this.mounted && this.setState({projects: data})  
                this.mounted && this.setState({isLoading: false})  
            })
        }
        
    }

    componentWillUnmount(){
        this.mounted = false
    }

    onCreateProject() {
        browserHistory.push('/app/projects')
    }

    goToWorkResult(id) {
        browserHistory.push('/app/projects/' + id)
    }

    onDeleteProject() {
        this.setState({isDelete: false})
        this.props.deleteProject(this.state.tabState, this.state.deleteProject, (res) => {            
            this.onToast('Project (' + this.state.deleteProject.name + ') has been removed.')
        })
    }

    onCancelProject() {
        this.setState({isDelete: false})
    }

    

    onSort(sortKey){
        const _this = this
        let projects
        var sort_by = function(field, reverse, primer){            
            var key = primer === String ? 
                function(x) {return primer(x[field]).toUpperCase()} : 
                primer ?
                function(x) {return primer(x[field])} :
                function(x) {return x[field]};        
            reverse = !reverse ? 1 : -1;        
            return function (a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            } 
        }
        this.setState({isSort: false, sortTitle: sortKey})
        switch(sortKey) {
            case 'Date Added':
                projects = this.state.projects
                projects.sort(sort_by('updated_at', true, parseInt));
                this.setState({projects})
                break
            case 'Title':
                projects = this.state.projects
                projects.sort(sort_by('name', false, String));
                this.setState({projects})
                break
            default:
                break
        }
        setTimeout(function() {
            _this.setState({isSort: false})
        }, 500)
        
    }

    onLoadProject(index, project) {
        const LN = this.state.loadNumber + 1 
        let projects = this.state.projects
        if(LN === this.state.projects.length){
            this.setState({Sortable: true})
        }
        projects[index] = project
        this.setState({loadNumber: LN, projects})        
    }

    onClickProjectTap(tabTitle) {
        this.setState({tabState: tabTitle});
        this.initProjects(tabTitle)
        // switch(tabTitle) {
        //     case 'My Projects':

        //         break
        //     case 'Shared Projects':

        //         break
        //     default:
        // }
    }

    render() {
        const _this = this
        console.log('My Projects', this.state.projects)
        return (
            <main>
                <div style={{fontSize: 15}}>
                    <Notifications />                
                </div>            
                <Header onSignOut={() => this.props.signOut()}/>
                    {
                        this.state.isDelete?
                        <DeleteForm isProject={true} isShared={this.state.tabState === 'Shared Projects'} name={this.state.deleteProject.name} onDelete={() => this.onDeleteProject()} onCancel={() => this.onCancelProject()} />
                        :
                        <div className="medium-width">
                            <div className="loading-container">
                                <Loading
                                    show={this.state.isLoading}
                                    color="red"
                                />
                            </div>
                            <header className="projects">
								<nav className="projects-header-left">
									<ul>
										<li>
			                                <button type="button" className="sq" onClick={() => this.onCreateProject()}>
			                                    <i className="icon-add"></i>
			                                    <span className="tablet-hide">Create Project</span>
			                                </button>
										</li>
									</ul>
								</nav>
                                <h1>
                                    <button onClick={() => this.onClickProjectTap('My Projects')}>
                                        <span style={{color: this.state.tabState === 'My Projects' ? '#373D47' : '#898E96'}}>My Projects</span>
                                    </button>
                                    |
                                    <button onClick={() => this.onClickProjectTap('Shared Projects')}>
                                        <span style={{color: this.state.tabState === 'Shared Projects' ? '#373D47' : '#898E96'}}>Shared Projects</span>
                                    </button>
                                </h1>
                                {
                                    this.state.Sortable?
                                    <div className="projects-header-right" onMouseOver={() => this.setState({isSort: true})} onMouseLeave={() => this.setState({isSort: false})}>
	                                    <nav>
											<ul className="nav-menu">
												<li className="main-nav-link">
													<a id="nav-sort-project">Sort: {this.state.sortTitle}
                                        			{
			                                            this.state.isSort?
			                                            <i className="icon icon-arrow-up"></i>
			                                            :
			                                            <i className="icon icon-arrow-down"></i>
			                                        }
                                        	</a>
	                                        {
	                                            this.state.isSort?
				                                        <div className="sub-nav filter-results">
															<ul className="sub-nav-group">
					                                            <li><a onClick={() => this.onSort('Date Added')}>Date Added</a></li>
	                                                			<li><a onClick={() => this.onSort('Title')}>Title</a></li>
	                                            			</ul>
														</div>
	                                            :null
	                                        }                                    
											</li>
										</ul>
									</nav>                                                             
                                </div>
                                    :null
                                }                                
                            </header>                    
                                {
                                    <section className="project-list"> 
										<div className="item-list">
                                        {
                                            this.state.projects.length === 0?
                                            <div className="empty-project-text">No results</div>
                                            :this.state.projects.map(function(project, index){
                                                return(
                                                        <ProjectItem 
                                                            id={project.project_id} 
															key={index} 
                                                            onNavigate={() => _this.goToWorkResult(project.project_id)} 
                                                            isFile={false} 
                                                            onLoad={(project) => _this.onLoadProject(index, project)}
                                                            onDelete={(project) => _this.setState({isDelete: true, deleteProject: project})}
                                                            isShared={_this.state.tabState === 'Shared Projects'}
                                                            handle={_this.props}/>
                                                )
                                            })
                                        }    
										</div>                              
                                    </section>
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
    }
}, mapDispatchToProps)(AllProjects);