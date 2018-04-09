import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../../redux/action'
import Header from '../../../component/Header'
import FileDrop from '../../../component/FileDrop'
import WorkItem from '../../../component/WorkItem'
import Notifications, {notify} from 'react-notify-toast';
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import * as controller from '../../../lib/controller'
import { CircularProgress } from 'material-ui/Progress';
import DeleteForm from '../../../component/Delete'
import ShareForm from '../../../component/Share'
import ProfileImage from '../../../component/ProfileImage'

require('./index.css')
var FileInput = require('react-file-input');
const person = require('../../../resource/images/person.png')



class Project extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fileSelected: true,
            fileArray: [],
            project_id: this.props.params.id,
            project: {},
            isLoading: false,
            isDelete: false,
            //to prevent conflict with fetched files in real time and new uploading files
            n_completed: 0,
            n_uploading: 0,
            owner: {},
            sortTitle: 'Date Added',
            isSorted: false//to show sorted result after completed sorting
        }
    }

    componentDidMount() {
        const _this = this
        this.mounted = true
        this.setState({isLoading: true})
        let MY_UID, MY_EMAIL
        try{
            MY_UID = localStorage.getItem('uid')
            MY_EMAIL = JSON.parse(localStorage.getItem('user')).email
        }
        catch(e){
            browserHistory.push('/')
            return
        }

        this.props.getWorks(this.state.project_id, (project) => {

            //check the work state(own project?, user's project?, access denied?)
            if(project.uid === MY_UID) {
                this.mounted && this.setState({ProjectState: 'Own'})
            }else if(project.share === undefined){
                this.mounted && this.setState({ProjectState: 'Denied'})
            }
            else if(project.share.toLowerCase().indexOf(MY_EMAIL.toLowerCase()) > -1){
                this.props.getUserDetails(project.uid, (owner) => {
                    this.mounted && this.setState({owner, ProjectState: 'User'})
                })
            }
            else {
                this.mounted && this.setState({ProjectState: 'Denied'})
            }

            if(project.workIds === undefined || JSON.parse(project.workIds).length === 0){
                this.setState({fileSelected: false})
            }
            else this.setState({fileSelected: true})


            this.mounted && this.setState({project, isLoading: false})
            if(this.state.n_completed === this.state.n_uploading){
                let PW = []
                let temp = []
                if(project.workIds !== undefined) temp = JSON.parse(project.workIds)
                temp.map(function(id, index){
                    let previouswork = {state: 'previouswork', work_id: id}
                    PW.push(previouswork)
                })
                console.log('WorkIds are exist: ', project.workIds)
                this.mounted && this.setState({fileArray: PW})

                //get work details, then sort with the key values
                _this.getAllWorks(temp)
            }
        })
    }

    componentWillUnmount() {
        this.mounted = false
    }

    onAddWork() {
        const state = this.state.fileSelected
        this.mounted && this.setState({fileSelected: !state})
    }

    onShare() {
        this.mounted && this.setState({isShare: true})
    }

    onShareProject(email) {
        console.log('Shared email: ', email)
        this.props.shareProject(this.state.project, email)
    }

    handleChangeFile (event) {
        this.onDrop(event.target.files)
    }

    getFileType(fileType) {
        if(fileType.indexOf('jpeg') > -1) return 'JPEG'
        else if(fileType.indexOf('jpg') > -1) return 'JPG'
        else if(fileType.indexOf('png') > -1) return 'PNG'
        else if(fileType.indexOf('mp3') > -1) return 'MP3'
        else if(fileType.indexOf('pdf') > -1) return 'PDF'
        else if(fileType.indexOf('word') > -1) return 'WORD'
        else if(fileType.indexOf('mp4') > -1) return 'MP4'
        else if(fileType.indexOf('video') > -1) return 'VIDEO'
        else {
            let myColor = { background: '#0E1717', text: "#FFFFFF" };
            notify.show("Invalid file type detected!", "error", 3000, myColor);
            return 'Invalid'
        }
    }

    onDrop(files, event) {
        const _this = this
        let fileArray = this.state.fileArray
        const CT = new Date().getTime()
        const UID = localStorage.getItem('uid');
        let n_uploading = 0
        for(let index = 0; index < files.length; index++){

            let file = {}
            //set file type
            const fileType = files[index].type
            if(this.getFileType(fileType) === 'Invalid') continue
            else file['type'] = this.getFileType(fileType)
            console.log('File type is ', fileType)
            if(file['type'] === 'WORD' || file['type'] === 'PDF'){
              file['cloudConvert'] = true;
            }
            n_uploading += 1
            file['feedback'] = 0
            file['work_id'] = controller.makeProjectID(UID, CT + index)
            file['name'] = files[index].name;
            file['updated_at'] = CT
            file['comments'] = []
            file['project_id'] = this.state.project_id
            file['image'] = 'files/' + file['name']
            file['file'] = files[index];
            fileArray.push(file)
            this.mounted && this.setState({fileArray, fileSelected: true});
        }
        this.mounted && this.setState({n_completed: 0, n_uploading})
        var objDiv = document.getElementById("project-list");
        if(objDiv) objDiv.scrollTop = objDiv.scrollHeight;
    }

    onClickWorkItem(workIndex, file) {
        browserHistory.push(this.props.location.pathname + '/works/' + (workIndex + 1))
    }

    onDeleteProject() {
        this.setState({isDelete: false})
        this.props.deleteWork(this.state.deleteWork, this.state.project)
    }

    onCancelDelete() {
        this.setState({isDelete: false})
    }

    goBack() {
        browserHistory.goBack()
    }

    onSort(sortKey){
        const _this = this
        let fileArray
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
        this.mounted && this.setState({isSort: false, sortTitle: sortKey, isSorted: false})
        fileArray = this.state.fileArray
        console.log('before sorting: ', fileArray)
        switch(sortKey) {
            case 'Date Added':
                fileArray.sort(sort_by('work_id', true, String));
                break
            case 'File Name':
                fileArray.sort(sort_by('name', false, String));
                break
            case 'File Type':
                fileArray.sort(sort_by('type', false, String));
                break
            case 'Feedback':
                fileArray.sort(sort_by('feedback', true, parseInt));
                break
            default:
                break
        }
        console.log('after sorting: ', fileArray)

        setTimeout(function() {
            _this.mounted && _this.setState({fileArray})
            _this.mounted && _this.setState({isSort: false, isSorted: true})
            _this.updateSortedWorkIds()
        }, 1000)
    }

    updateSortedWorkIds() {
        let temp = []
        this.state.fileArray.map(function(file, index) {
            temp.push(file.work_id)
        })
        this.props.setSortedWorkIds(temp)
    }

    getAllWorks(workIds) {

        const _this = this
        this.mounted && this.setState({Sortable: false})
        this.props.setSortedWorkIds(workIds)
        let fileArray = []
        workIds.map(function(id, index){
            let temp = {}
            _this.props.getWorkDetails(id, (file) => {
                if(_this.mounted){
                    temp['state'] = 'previouswork'
                    temp['work_id'] = id
                    temp['name'] = file.name
                    temp['type'] = file.type
                    temp['tempName'] = file.tempName
                    temp['htmlName'] = file.htmlName
                    temp['cloudConvert'] = file.cloudConvert
                    temp['feedback'] = file.feedback
                    fileArray.push(temp)
                }
            })
        })
        setTimeout(function() {
            _this.setState({fileArray})
            _this.onSort('Date Added')
        }, 1000)
        this.mounted && this.setState({Sortable: true})
        console.log('Process work details...')
    }

    render() {
        const _this = this
        console.log('Project Works: ', this.state.fileArray)
        console.log('Projects Sorted: ', this.state.isSorted)
        return (
            <main>
                <Notifications />
                <Header onSignOut={() => this.props.signOut()}/>
                {
                    this.state.isDelete?
                    <DeleteForm isProject={false} name={this.state.deleteWork.name} onDelete={() => this.onDeleteProject()} onCancel={() => this.onCancelDelete()} />
                    :this.state.isShare?
                    <ShareForm onClose={() => this.setState({isShare: false})} onShare={(email) => this.onShareProject(email)}/>
                    :this.state.ProjectState === 'Denied'?
                    <div className="access-denied container">
                        <button className="icon-close-full" onClick={() => {this.props.onClose()}}></button>
                        <center className="share-title">Access Denied!</center>
                        <center className="delete-message">This user has not given you access to their project.</center>
                        <center><button className="share-button-done" onClick={() => this.goBack()}>GO BACK</button></center>
                    </div>
                    :this.state.ProjectState === null?null
                    :
                    <div className={this.state.fileArray.length > 0 ? "medium-width" : "medium-width full-height-centered" }>
                        <header className={this.state.fileArray.length > 0 ? "projects" : "projects empty" }>
                            {
                                this.state.ProjectState === 'Own'?
								<nav className="projects-header-left">
									<ul className="nav-menu">
	                                    <li className="main-nav-link">
											<button type="button" className="sq" onClick={() => this.onAddWork()}>
	                                        {
	                                            this.state.fileSelected?
	                                            <div>
	                                                <i className="icon-add"></i>
	                                                Add Work
	                                            </div>
	                                            :
	                                            <div>View Works</div>
	                                        }
	                                    	</button>
										</li>
	                                {
	                                    this.state.fileArray.length > 0?
	                                        <li className="main-nav-link">
												<button type="button" className="sq white" onClick={() => this.onShare()}>
	                                            <i className="icon-mail"></i>
	                                            Share Project
	                                        </button></li>
	                                    :null
	                                }
									</ul>
								</nav>
                                :
                                <nav className="projects-header-left">
                                    <ul className="nav-menu">
                                        <li className="main-nav-link">
                                                {
                                                this.state.owner.uid === undefined?null
                                                :<ProfileImage id={this.state.owner.uid} handle={this.props}/>
                                            }
                                            <span className="profile-name">{this.state.owner.name}</span>
                                        </li>
                                    </ul>
                                </nav>
                            }
                            <h1 className="truncate">{this.state.project.name}</h1>
                            {
                                this.state.Sortable && this.state.fileArray.length > 0 && this.state.fileSelected ?
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
				                                            <li><a onClick={() => this.onSort('File Name')}>File Name</a></li>
				                                            <li><a onClick={() => this.onSort('File Type')}>File Type</a></li>
				                                            <li><a onClick={() => this.onSort('Feedback')}>Feedback</a></li>
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
                            //Showing Work List
                            this.state.fileSelected?
                            <section className="project-list" id="project-list">
								<div className="item-list">
                                {
                                    this.state.isLoading?
                                    <CircularProgress color='accent' className="work-loading-bar"/>
                                    :this.state.fileArray.length === 0?
                                    <p>This project has no work yet.</p>
                                    :this.state.isSorted?
                                    this.state.fileArray.map(function(file, index){
                                        console.log('File' + index + ': ', file)
                                        return(
                                                <WorkItem
                                                    file={file}
                                                    project={_this.state.project}
                                                    handle={_this.props}
													key={index}
                                                    isOwn={_this.state.ProjectState === 'Own'}
                                                    onCompleteUpload={() => {
                                                        _this.setState({n_completed: _this.state.n_completed + 1})
                                                    }}
                                                    onDelete={(work) => _this.setState({isDelete: true, deleteWork: work})}
                                                    onNavigate={() => _this.onClickWorkItem(index, file)}/>
                                        )
                                    })
                                    :null
                                }
								</div>
                            </section>
                            ://Showing Upload File View
                            <section className="project-list empty">
                                <div>
                                    <label>
                                        <FileDrop frame={document} targetAlwaysVisible={false} onDrop={(files, event) => this.onDrop(files, event)}/>
										<input type="file" ref={(ref) => this.fileEvent = ref} onChange={(event) => this.handleChangeFile(event)}/>
                                        <i className="icon-plus-full"></i>
                                    </label>
                                    <h2>Get Started by Draging files in</h2>
                                    <p>You can add various file types.</p>
                                    <p>Word, PDF, Images, Audio, Videos, PSDs and more</p>
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
        r_user: state.loginReducer.user,
        r_project: state.projectReducer.selected_project,
        r_allProjects: state.loginReducer.myProjects,
        r_sorted_workIds: state.projectReducer.sorted_workIds
    }
}, mapDispatchToProps)(Project);
