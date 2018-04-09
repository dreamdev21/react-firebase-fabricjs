'use strict';

module.exports = {
    UserExample: {
        uid: 'asdgsdag',
        displayName: '...',
        photoURL: '...',
        email: '...',
        emailVerified: false,
        phoneNumber: '...',
        isAnonymous: false,
        //...
    },

    ValidFileTypes: [
        'image/jpeg', 
        'image/png', 
        'image/jpg', 
        'image/JPG', 
        'image/PNG', 
        'image/JPEG',
        'application/pdf',
        'application/msword',
        'audio/mp3',
        'video/quickTime'
    ],
    
    Database_Structure: {
        Project: {
            project_id: {
                name: '',
                worknumber: '',
                feedback: '',
                workIds: '',
                project_id: '',
                uid: '',
                updated_at: '',
            }
        },
        Work: {
            work_id: {
                name: '',
                image: '',
                type: '',
                feedback: '',
                comments: {
                    user_id:{
                        user_id: '',
                        user_name: '',
                        date: '',
                        annotation: [
                            {
                                type: 'text',
                                text: ''
                            },
                            {
                                type: 'image',
                                url: ''
                            },
                            {
                                type: 'other',
                                ext: '',
                                url: ''
                            }
                        ],
                        reply:{
                            text: '',
                            date: '',
                            user_id: '',
                            user_name: ''
                        }
                    }                    
                },
                project_id: '',
                work_id: '',
                updated_at: ''
            }
        },
        User: {
            uid: {
                social: '',
                notification: '',
                photo: '',
                name: '',
                email: '',
                password: '',
                project_ids: '',
                uid: ''
            }
        },
        Activity: {
            Left: {
                user_id: {
                    date: {
                        work_id: '',
                        annotation: ''
                    }
                }
            },
            Receive: {
                user_id: {
                    date: {
                        user_id: '',
                        work_id: '',
                        annotation: ''
                    }
                }
            }
        }
    }
}