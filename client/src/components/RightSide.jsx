import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../redux/apiCalls';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';

const RightSide = () => {
    const [followers, setFollowers] = useState([]);
    const [isloading,setIsloading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getFollowers();
    }, [])

    const getFollowers = async () => {
        try {
            setIsloading(true)
            const res = await axios.get(process.env.REACT_APP_API_URL + '/users/followers', {
                headers: {
                    'access_token': getToken(),
                }
            })
            if (res) {
                setIsloading(false)
                setFollowers(res.data);
            }
        } catch (error) {
            setIsloading(false);
            setError(error.response.data.message);
        }
    }

    if (isloading) return <div className='flex justify-center items-center mt-10'><Spinner /></div>
    return (
        <div className='overflow-auto h-screen mt-6  '>
            <div className='space-y-6'>
                <h1 className='text-xl font-bold text-gray-500'>Followers</h1>
                {followers.length !== 0 ? followers.map(user => (
                    <Link to={`/profile/${user._id}`} key={user._id} className='flex gap-2 items-center cursor-pointer '>
                         <img className='h-10 w-10 object-contain rounded-full cursor-pointer' src={user?.profileimg ? process.env.REACT_APP_PUBLIC_FOLDER + user.profileimg : "https://static.intercomassets.com/avatars/4439477/square_128/Glasses_Blue-1614106445.png"} alt="" />
                        <span>{user.name}</span>
                    </Link>
                )) : <h1 className='text-sm text-blue-600'>No Followers</h1>}
                {error && <h1>{error}</h1>}
            </div>
        </div>
    )
}

export default RightSide