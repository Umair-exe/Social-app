import axios from 'axios';
import { addFriend, addFriendFromProfile, fail } from './appSlice';
import { errSuccess, failure, like, start, success } from './postSlice';
import { errorSuccess, loginFailure, loginStart, loginSuccess, removeFriend, uploadProfile } from './userSlice';

const url = process.env.REACT_APP_API_URL;

export const getToken = () => {
    return localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;
}

export const login = async (dispatch, data) => {
    try {
        dispatch(loginStart());
        const res = await axios.post(url + '/auth', data);
        localStorage.setItem('access_token', res.data.token);
        dispatch(loginSuccess(res.data.user));
    } catch (error) {
        dispatch(loginFailure(error.response.data.message))
        setTimeout(() => {
            dispatch(errorSuccess())
        }, 5000)
    }

}
export const getPosts = async (dispatch) => {
    try {
        dispatch(start())
        const res = await axios.get(url + '/post', {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        });
        if (res) {
            dispatch(success(res.data));
        }
    } catch (error) {
        console.log(error)
        dispatch(failure(error.response.data.message))
        setTimeout(() => {
            dispatch(errSuccess());
        }, 5000);
    }
}


export const handleLike = async (dispatch, id, userid) => {

    try {
        dispatch(like({ id, userid }));
        await axios.put(`${url}/post/like/${id}`, "", {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })

    } catch (error) {
        console.log(error.response.data.message);
    }

}

export const handledisLike = async (dispatch, id, userid) => {

    try {
        dispatch(like({ id, userid }));
        await axios.put(`${url}/post/dislike/${id}`, "", {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })

    } catch (error) {
        console.log(error.response.data.message);
    }

}

export const handleAddFriend = async (dispatch, id, userId, filter) => {
    try {
        if (filter === 0) {
            dispatch(addFriend({ id, userId }))
        }
        else {
            dispatch(addFriendFromProfile({ id, userId }))
            dispatch(removeFriend(id));
        }
        await axios.put(`${url}/users/follow/${id}`, "", {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })
    } catch (error) {
        dispatch(fail(error.response.data.message))
    }

}

export const handleRemoveFriend = async (dispatch, id, userId, filter) => {

    try {
        if (!window.confirm("are you sure you want to remove this friend")) return;
        if (filter === 0) {
            dispatch(addFriend({ id, userId }))
        }
        else {
            dispatch(addFriendFromProfile({ id, userId }))
            dispatch(removeFriend(id));
        }

        await axios.put(`${url}/users/unfollow/${id}`, "", {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })

    } catch (error) {
        dispatch(fail(error.response.data.message))
    }

}

export const deletePost = async (dispatch, postid) => {

    try {
        if (!window.confirm("are you sure you want to delete this post")) return;
        const res = await axios.delete(`${url}/post/delete/${postid}`, {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })
        if (res) getPosts(dispatch);

    } catch (error) {
        dispatch(fail(error.response.data.message))
    }

}


export const handleProfileUpload = async (dispatch, data) => {

    try {
        const res = await axios.post(url + '/upload', data);
    } catch (error) {
        console.log(error)
    }

    try {
        const result = await axios.put(url + '/users/uploadProfile/', {
            imgUrl: `uploads/${data.get('name')}`
        }, {
            'content-type': 'multipart/form-data',
            headers: {
                'access_token': getToken()
            }
        })
        if (result) {
            dispatch(uploadProfile(result.data));
        }
    } catch (error) {
        console.log(error);
    }
}