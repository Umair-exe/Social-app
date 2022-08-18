import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom'
import ProfileHeader from '../components/ProfileHeader';
import { getToken, handleAddFriend, handleProfileUpload, handleRemoveFriend } from '../redux/apiCalls';
import { cleanProfile, responseCame, start, userProfile } from '../redux/appSlice';
import Spinner from './Spinner';
import toast from 'react-hot-toast';


const ProfileLayout = ({ children }) => {
    const { user } = useSelector(state => state.user);
    const [error, setError] = useState('');
    const { id } = useParams();
    const [profile, setProfile] = useState('');
    const diffUser = useSelector(state => state.app.user);
    const { isloading } = useSelector(state => state.app);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user._id === id) {
            dispatch(cleanProfile())
            return;
        }
        getDetails();
    }, [id])


    const getDetails = async () => {
        try {
            dispatch(start());
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/post/profile/${id}`, {
                headers: {
                    'access_token': getToken(),
                }
            })
            if (res) {
                dispatch(responseCame())
                let { user, posts } = res.data;
                dispatch(userProfile({ user, posts }));
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    const uploadProfile = async () => {

        const data = new FormData();
        const filename = Date.now() + profile.name;
        data.append('name', filename);
        data.append('file', profile);

        handleProfileUpload(dispatch, data).then(() => {
            setProfile('')
            toast.success("profile picture uploaded!!")
        });

    }

    if (isloading) return <div className='flex justify-center mt-20'><Spinner /></div>
    return (
        <div className=''>
            <div className=" mt-20 flex justify-between items-center">
                <div className='flex gap-5 items-center '>
                    <div className='flex flex-col'>
                        <img className='rounded-full h-40 w-40 object-contain' src={!diffUser ? (user?.profileimg ? process.env.REACT_APP_PUBLIC_FOLDER + user?.profileimg : 'https://static.intercomassets.com/avatars/4439477/square_128/Glasses_Blue-1614106445.png') : (diffUser?.profileimg ? process.env.REACT_APP_PUBLIC_FOLDER + diffUser.profileimg : 'https://static.intercomassets.com/avatars/4439477/square_128/Glasses_Blue-1614106445.png')} alt='profileImage' />
                    </div>

                    <div className='flex flex-col'>
                        <span className='text-3xl font-bold ' >{!diffUser ? user.name : diffUser?.name}</span>
                        <span className='text-xl font-bold text-gray-500'>{!diffUser ? user.followers.length : diffUser?.followers.length} followers</span>
                    </div>
                </div>
                {diffUser && <div>
                    <button onClick={() => diffUser.followers.includes(user._id) ? handleRemoveFriend(dispatch, diffUser._id, user._id, 1)
                        : handleAddFriend(dispatch, diffUser._id, user._id, 1)}
                        className='p-2 px-6 bg-blue-200 text-blue-600 rounded font-bold' >

                        {diffUser.followers.includes(user._id) ? `Following` : `Follow`}
                    </button>
                </div>}
            </div>

            {!diffUser && <label htmlFor='file' className='flex mt-4' >
                <input type="file"
                    className={`block w-full  ${profile ? `text-gray-500` : `text-transparent`}  file:mr-4 file:p-2 file:px-6 file:rounded-full file:border-0 file:font-bold file:bg-blue-200 file:text-blue-600`}
                    onChange={e => setProfile(e.target.files[0])} name='Change Profile Image' accept='.png,.jpg,.jpeg' />
                {profile && <button onClick={() => uploadProfile()} className='p-2 px-6 bg-blue-200 text-blue-600 rounded font-bold'>Upload</button>}
            </label>}

            <hr />
            {!diffUser ? <>
                <ProfileHeader />
                {error.length !== 0 && error.message}

                <div className='mt-6'>
                    {children}
                    <Outlet />
                </div>
            </> :
                diffUser.followers.includes(user._id) ? <>
                    <ProfileHeader />
                    {error.length !== 0 && error.message}

                    <div className='mt-6'>
                        {children}
                        <Outlet />
                    </div>
                </> : null
            }


        </div>
    )
}

export default ProfileLayout