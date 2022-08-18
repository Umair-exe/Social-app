import axios from 'axios';
import React from 'react'
import { useDeferredValue } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { handleAddFriend, handleRemoveFriend } from '../redux/apiCalls';
import { fail, start, stop } from '../redux/appSlice';
import Spinner from './Spinner';

const SearchUsers = () => {
    const { user } = useSelector(state => state.user);
    const { name } = useParams();
    const defferedValue = useDeferredValue(name);
    const dispatch = useDispatch();
    const { searchedUsers, isloading, error } = useSelector(state => state.app);

    useEffect(() => {
        getUsers();
    }, [defferedValue]);


    const getUsers = async () => {
        try {
            dispatch(start());
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/search/${name}`, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            })
            dispatch(stop(res.data));
        } catch (error) {
            dispatch(fail(error.response.data.message));
        }
    }


    if (isloading) return <div className='flex justify-center items-center mt-20'><Spinner /></div>
    return (
        <div className='mt-6'>
            {error ? error.message : null}
            {searchedUsers?.length !== 0 ? searchedUsers?.map((usertemp, i) => (
                usertemp._id !== user._id && <div key={i} className='flex justify-between items-center p-4 bg-white shadow-lg rounded'>
                    <Link className='flex items-center gap-4' to={`/profile/${usertemp._id}`}>
                        <img className='rounded-full h-14 w-14' src="https://static.intercomassets.com/avatars/4439477/square_128/Glasses_Blue-1614106445.png" alt="avatar" />
                        <div className='flex flex-col'>
                            <span className='text-xl font-bold cursor-pointer'>{usertemp.name}</span>
                            <span className=''>followers: {usertemp.followers.length} . following: {usertemp.following.length}  </span>
                        </div>
                    </Link>

                    <button onClick={() => usertemp.followers.includes(user._id) ? handleRemoveFriend(dispatch, usertemp._id, user._id,0)
                        : handleAddFriend(dispatch, usertemp._id, user._id,0)}
                        className='p-2 px-6 bg-blue-200 text-blue-600 rounded font-bold' >

                        {usertemp.followers.includes(user._id) ? `Following` : `Follow`}
                    </button>
                </div>
            )) : <h1 className='text-3xl font-bold text-blue-600'>No Results</h1>}
        </div>
    )
}

export default SearchUsers