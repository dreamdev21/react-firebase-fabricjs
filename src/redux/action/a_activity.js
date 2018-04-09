import * as types from './types'
import firebase from 'firebase'

export function getActivity(activity, uid, callback) {
    return dispatch => {        
        const path = '/Activity/' + activity + '/' + uid
        firebase.database().ref(path).on('value', (snapshot) => {
            var Data = {}
            if(snapshot.val()){
                Data = snapshot.val()
            }
            callback(Data)
        })
    }
}

export function getWorkURL(activity, callback) {
    return dispatch => {
        const path = '/Project/' + activity.project_id
        firebase.database().ref(path).on('value', (snapshot) => {
            if(snapshot.val()){
                const workIds = JSON.parse(snapshot.val().workIds)
                callback(workIds.indexOf(activity.work_id))                
            }
            else{
                callback(-1)
            }            
        })
    }
}

export function formatSortedWorks() {
    return{
        type: types.SORTED_WORKIDS,
        workIds: []
    }
}