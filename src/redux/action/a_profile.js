import firebase from 'firebase'

export function updateProfile(user, callback) {
    return dispatch => {
        var updates = {};
        const path = '/User/' + user.uid
        updates[path] = user;
        firebase.database().ref().update(updates)
        localStorage.setItem('user', JSON.stringify(user))
        callback('success')
    }
}

export function setUserNotification(user, value, callback) {
    return dispatch => {
        var updates = {};
        const path = '/User/' + user.uid
        if(user.notification === undefined) user['notification'] = value
        else user.notification = value
        updates[path] = user;
        firebase.database().ref().update(updates).then((res) => {
            localStorage.setItem('user', JSON.stringify(user))
            callback('success')
        })
        .catch((e) => callback(e.toString()))        
    }
}