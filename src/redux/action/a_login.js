import * as types from './types'
import { push } from 'react-router-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import * as FB from './firebase';
import firebase from 'firebase'

export function registerUser(user, callback) {
    return dispatch => {
        FB.firebaseAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then(userInfo => {
            let data = {
                uid: userInfo.uid,
                displayName: userInfo.email.split('@')[0],
                email: userInfo.email,
                photoURL: userInfo.photoURL
            }
            dispatch(setUser(data, 0))  
            callback('success')
        })
        .catch(error => callback(error.message))
    }
}

export function loginUser(user, callback) {
    return dispatch => {
        FB.firebaseAuth.signInWithEmailAndPassword(user.email, user.password)
        .then(userInfo => {
            dispatch(setUser(userInfo, 0))
            callback('success')
        })
        .catch(error => callback(error.message))
    }
}

export function resetPassword(email, callback) {
    return dispatch => {
        FB.firebaseAuth.sendPasswordResetEmail(email)
        .then(userInfo => {
            callback('success')
        })
        .catch(error => callback(error.message))
    }
}

export function loginWithProvider(p, callback) {
    return dispatch => {
        const provider = getProvider(p);
        return FB.firebaseAuth.signInWithPopup(provider).then(() => {
            dispatch(setUser(FB.firebaseAuth.currentUser, 1))
            callback('success')
        })
        .catch(error => callback(error.message))
    }
}

export function signOut() {
    return dispatch => {
        return FB.firebaseAuth.signOut().then(() => {
            localStorage.clear()
            browserHistory.push('/')
        })
    }
}

export function getProvider(provider) {
    switch (provider) {
    case 'email':
        return new firebase.auth.EmailAuthProvider();
    case 'facebook':
        return new firebase.auth.FacebookAuthProvider();
    case 'github':
        return new firebase.auth.GithubAuthProvider();
    case 'google':
        return new firebase.auth.GoogleAuthProvider();
    case 'twitter':
        return new firebase.auth.TwitterAuthProvider();
    default:
        throw new Error('Provider is not supported!!!');
    }
}

export const setUser = (user, social) => {
    return dispatch => {
        localStorage.setItem('uid', user.uid);
        let userData = {
            social,
            notification: 1,
            photo: user.photoURL,
            name: user.displayName,
            email: user.email,
            password: '',
            project_ids: [],
            uid: user.uid
        }
        localStorage.setItem('user', JSON.stringify(userData));
        FB.firebaseDb.ref('/User/' + user.uid).on('value', (snapshot) => {
            var Data = {}
            if(snapshot.val()){
                Data = snapshot.val()
                console.log(Data)
                console.log('Existing User!')
                localStorage.setItem('user', JSON.stringify(Data));
            }
            else{
                console.log('New user!')
                dispatch(setUserData(userData))
            }
        })        
    }
}

export function setUserData(userData) {
    return dispatch => {
        FB.firebaseDb.ref('/User/' + userData.uid).set(userData)        
    }
}


export const a_welcome = (state) => {
    return {
        type: types.WELCOME,
        state
    };
}