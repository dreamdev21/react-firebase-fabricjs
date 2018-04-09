import * as types from './types'
import firebase from 'firebase'
// Initialize Cloud Firestore through Firebase

export function a_selectProject(project) {
    return {
        type: types.SELECTED_PROJECT,
        project,
    };
}

export function getMyProjects(callback) {
    return dispatch => {
        const uid = localStorage.getItem('uid')
        const path = '/User/' + uid
        firebase.database().ref(path).on('value', (snapshot) => {
            var Data = {}
            if(snapshot.val()){
                Data = snapshot.val()
            }
            localStorage.setItem('user', JSON.stringify(Data))
            callback(Data)
        })
    }
}



export function createProject(project, callback) {
    return dispatch => {
        const uid = localStorage.getItem('uid')
        const path1 = '/Project/' + project.project_id
        const path2 = '/User/' + uid
        firebase.database().ref(path1).set(project)

        let userData = JSON.parse(localStorage.getItem('user'))
        if(userData.project_ids === undefined){
            const temp = [project.project_id]
            userData.project_ids = JSON.stringify(temp)
        }
        else{
            let temp = JSON.parse(userData.project_ids)
            temp.push(project.project_id)
            userData.project_ids = JSON.stringify(temp)
        }
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('Update UserData: ', userData)
        var updates = {};
        updates[path2] = userData;
        firebase.database().ref().update(updates)
        callback('success')
    }
}

export function getProjectDetail(id, callback) {
    return dispatch => {
        const path = '/Project/' + id
        firebase.database().ref(path).on('value', (snapshot) => {
            var Data = {}
            if(snapshot.val()){
                Data = snapshot.val()
            }
            callback(Data)
        })
    }
}

export function getWorks(id, callback) {
    return dispatch => {
        const uid = localStorage.getItem('uid')
        const path = '/Project/' + id
        firebase.database().ref(path).on('value', (snapshot) => {
            var Data = {}
            if(snapshot.val()){
                Data = snapshot.val()
            }
            callback(Data)
        })
    }
}



export function getFileWithName(name, callback) {
    return dispatch => {
        // console.log('Work Image is ', name)
        if(name !== undefined){
            firebase.storage().ref().child(name).getDownloadURL().then(function(url) {
                // `url` is the download URL for 'images/stars.jpg'

                // This can be downloaded directly:
                // Or inserted into an <img> element:
              console.log('Firebase URL:',url)
                callback(url)
            }).catch(function(error) {
            // Handle any errors
            });
        }
    }
}

export function deleteProject(category, project, callback) {
    return dispatch => {
        let path
        if(category === 'My Projects'){
            //remove project id from user's profile
            let userData = JSON.parse(localStorage.getItem('user'))
            let temp = JSON.parse(userData.project_ids)
            const index = temp.indexOf(project.project_id)
            if(index > -1) temp.splice(index, 1)
            userData.project_ids = JSON.stringify(temp)
            localStorage.setItem('user', userData)

            path = '/User/' + userData.uid
            var updates = {};
            updates[path] = userData;
            firebase.database().ref().update(updates)
            console.log(userData)

            //remove project
            path = '/Project/' + project.project_id
            firebase.database().ref(path).remove().then((res) => {
                console.log('Delete result', res)
                //remove related works
                let requests = []
                if(project.workIds !== undefined){
                    const temp = JSON.parse(project.workIds)
                    temp.map(function(work_id, index){
                        const path = '/Work/' + work_id
                        firebase.database().ref(path).remove().then((res) => {
                            console.log('related work ' + index + ' has been removed')
                        })
                    })
                    callback('success')
                }
                else callback('success')
            })
        }
        else{
            const MY_EMAIL = JSON.parse(localStorage.getItem('user')).email
            path = '/Project/' + project.project_id
            firebase.database().ref(path).on('value', (snapshot) => {
                if(snapshot.val()){
                    let newProject = snapshot.val()
                    let temp = JSON.parse(newProject.share)
                    const index = temp.indexOf(MY_EMAIL)
                    if(index > -1){
                        temp.splice(index, 1)
                    }
                    var updates = {};
                    newProject.share = JSON.stringify(temp)
                    updates[path] = newProject;
                    firebase.database().ref().update(updates)
                }
                callback('success')
            })
        }
    }
}

export function getUserDetails(uid, callback) {
    return dispatch => {
        const path = '/User/' + uid
        firebase.database().ref(path).on('value', (snapshot) => {
            var Data = {}
            if(snapshot.val()){
                Data = snapshot.val()
            }
            callback(Data)
        })
    }
}

export function shareProject(project, email) {
    return dispatch => {
        let path = '/Project/' + project.project_id
        var updates = {};
        if(project.share === undefined) project['share'] = JSON.stringify([email])
        else{
            let temp = JSON.parse(project.share)
            temp.push(email);
            project['share'] = JSON.stringify(temp)
        }
        updates[path] = project;
        firebase.database().ref().update(updates)
    }
}

export function getSharedProjects(callback) {
    return dispatch => {
        const MY_EMAIL = JSON.parse(localStorage.getItem('user')).email
        const path = '/Project'
        firebase.database().ref(path).on('value', (snapshot) => {
            var Data = []
            if(snapshot.val()){
                const all_projects = snapshot.val()
                Object.keys(all_projects).map(function(key, index) {
                    const temp = all_projects[key]
                    if(temp.share !==undefined && temp.share.indexOf(MY_EMAIL) > -1){
                        Data.push({
                            project_id: temp.project_id
                        })
                    }
                })
            }
            callback(Data)
        })
    }
}
