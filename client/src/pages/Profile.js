
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

import Posts from '../components/Posts';


const Profile = () => {

    const { user } = useSelector(state => state.user);
    const { posts } = useSelector(state => state.post);
    const diffUser = useSelector(state => state.app.user);

    const diffPosts = useSelector(state => state.app.userPosts)

    useEffect(() => {
        document.title = 'Profile'
    }, [])


    return (
        <div className=''>
            {!diffUser ? posts?.map((post) => post.userId === user._id ? <Posts key={post._id} post={post} /> : null) : diffPosts?.map((post) => <Posts key={post._id} post={post} />)}
        </div>
    )
}

export default Profile