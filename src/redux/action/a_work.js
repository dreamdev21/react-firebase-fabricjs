import * as types from './types'
import firebase from 'firebase'
import * as controller from '../../lib/controller'

export function updateWorkDetails(work, callback) {
    return dispatch => {
        const path = '/Work/' + work.work_id
        var updates = {};
        updates[path] = work;
        firebase.database().ref().update(updates)
        callback('success')
    }
}

export function createWork(file, project, callback) {
    return dispatch => {
        const path1 = '/Work/' + file.work_id
        firebase.database().ref(path1).set(file)
        if(project.workIds === undefined){
            const temp = [file.work_id]
            project.workIds = JSON.stringify(temp)
        }
        else {
            let temp = JSON.parse(project.workIds)
            temp.push(file.work_id)
            project.workIds = JSON.stringify(temp)
        }
        const path2 = '/Project/' + project.project_id
        var updates = {};
        updates[path2] = project;
        firebase.database().ref().update(updates)
        callback(file.work_id)
    }
}

export function getWorkDetails(id, callback) {
    return dispatch => {
        const path = '/Work/' + id
        firebase.database().ref(path).on('value', (snapshot) => {
            var Data = {}
            if(snapshot.val()){
                Data = snapshot.val()
            }
            callback(Data)
        })
    }
}

export function deleteWork(work, project) {
    return dispatch => {
        let path = '/Work/' + work.work_id
        firebase.database().ref(path).remove()

        const feedback = work.feedback
        let temp = JSON.parse(project.workIds)
        const index = temp.indexOf(work.work_id)
        if(index > -1) temp.splice(index, 1)
        project.workIds = JSON.stringify(temp)
        project.feedback -= feedback
        path = '/Project/' + project.project_id
        var updates = {};
        updates[path] = project;
        firebase.database().ref().update(updates)
        console.log(project)
    }
}

export function addComment(project, file, fbArray, callback) {
    return dispatch => {
        let temp = [];
        //make comment structure
        fbArray.map(function(feedback, index){
            let annotation = {}
            if(feedback.type === 'text'){
                annotation = {
                    type: 'text',
                    text: feedback.comment
                }
            }
            else if(feedback.type === 'image'){
                annotation = {
                    type: 'image',
                    url: 'files/' + controller.myEncode(feedback.name)
                }
            }
            else if(feedback.type === 'other'){
                annotation = {
                    type: 'other',
                    ext: feedback.ext,
                    url: 'files/' + controller.myEncode(feedback.name)
                }
            }
            temp.push(annotation)
        })
        const UID = localStorage.getItem('uid')
        const UN = JSON.parse(localStorage.getItem('user')).name
        const CT = new Date().getTime()
        const newComment = {
            user_id: UID,
            user_name: UN,
            date: CT,
            annotation: JSON.stringify(temp)
        }

        //add comments and feedback
        if(file.comments === undefined){
            file['comments'] = {}
            file.comments[UID + CT] = newComment
        }
        else{
            file.comments[UID + CT] = newComment
        }
        file['feedback'] += 1

        //update comment in work data
        console.log('Work comment has been added')
        let path = '/Work/' + file.work_id
        var updates = {};
        updates[path] = file;
        firebase.database().ref().update(updates)

        //update feedback in project data
        console.log('Project feedback has been updated')
        path = '/Project/' + project.project_id
        var updates = {};
        project.feedback += 1
        updates[path] = project;
        firebase.database().ref().update(updates)

        //update activity data
        path = '/Activity/Left/' + UID + '/' + CT
        firebase.database().ref(path).set({
            work_id: file.work_id,
            project_id: project.project_id,
            annotation: newComment.annotation,
            title: file.name
        });

        path = '/Activity/Receive/' + project.uid + '/' + CT
        firebase.database().ref(path).set({
            user_id: UID,
            user_name: UN,
            annotation: newComment.annotation,
            work_id: file.work_id,
            project_id: project.project_id,
            title: file.name
        });

        callback('success')
    }
}

export function removeComment(project, work, key) {
    return dispatch => {

        //decrease feedback in work
        console.log('Comment has been removed')
        path = '/Work/' + work.work_id
        var updates = {};
        work.feedback -= 1
        updates[path] = work;
        firebase.database().ref().update(updates)

        let path = '/Work/' + work.work_id + '/comments/' + key
        firebase.database().ref(path).remove()


        //decrease feedback in project
        console.log('Project feedback has been updated')
        path = '/Project/' + work.project_id
        var updates = {};
        project.feedback -= 1
        updates[path] = project;
        firebase.database().ref().update(updates)
    }
}

export function replyComment(uid, name, key, text, comment, work) {
    return dispatch => {
        const CT = new Date().getTime()
        const path = '/Work/' + work.work_id + '/comments/' + key
        const newReply = {
            text,
            date: CT,
            user_id: uid,
            user_name: name
        }
        if(comment.reply === undefined){
            comment['reply'] = JSON.stringify([newReply])
        }
        else{
            let temp = JSON.parse(comment.reply)
            temp.push(newReply)
            comment.reply = JSON.stringify(temp)
        }
        var updates = {};
        updates[path] = comment;
        firebase.database().ref().update(updates)
    }
}

export function removeReply(work, reply) {
    return dispatch => {
        const path = '/Work/' + work.work_id + '/comments/' + reply.key
        let temp = reply.comment
        let replyData = JSON.parse(temp.reply)
        replyData.map(function(item, index){
            if(item.date === reply.replyDate){
                replyData.splice(index, 1)
                temp['reply'] = JSON.stringify(replyData)
                var updates = {};
                updates[path] = temp;
                firebase.database().ref().update(updates)
            }
        })
    }
}

export function setSortedWorkIds(workIds) {
    return{
        type: types.SORTED_WORKIDS,
        workIds
    }
}
