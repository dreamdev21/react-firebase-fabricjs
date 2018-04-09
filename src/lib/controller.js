import {
    encode,
    decode,
    encodeComponents,
    decodeComponents,
} from 'firebase-encode';

export function makeProjectID(uid, time) {
    const X = String(uid)
    const Y = String(time)
    let id = ''
    for(let i = 0; i<X.length; i++){
        id = id + X.substring(i, i + 1)
        id = id + Y.substring(i, i + 1)
    }
    return id
}

export function myEncode(str) {
    if(str === undefined) return ''
    return encode(str)
}

export function myDecode(str) {
    if(str === undefined) return ''
    return decode(str)
}

export function convertTimeStamp(stamp) {
        
    var seconds = Math.floor((new Date() - stamp) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return toDate(stamp)
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return toDate(stamp)
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
    return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
    return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
    return interval + " minutes ago";
    }
    return "Just Now";
}

export function toDate(stamp) {
    var d = new Date(stamp);
    return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear()
}