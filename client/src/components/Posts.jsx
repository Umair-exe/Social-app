import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'timeago-react';
import { deletePost, handledisLike, handleLike } from '../redux/apiCalls';

const Posts = ({ post }) => {
    const { user } = useSelector(state => state.user);
    const [options, setOptions] = useState(false);
    const dispatch = useDispatch();
    const [comments, setComments] = useState([]);
    // useEffect(() => {
    //     if (post) {
    //         getComments();
    //     }
    // }, [])

    // const getComments = async () => {
    //     try {
    //         const res = await axios.get(`/comment/get/${post._id}`, {
    //             headers: {
    //                 'access_token': localStorage.getItem('access_token')
    //             }
    //         })
    //         if (res) setComments(res.data);
    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }

    return (
        <div className='shadow-md p-4 px-8 mb-4 flex flex-col bg-white '>
            <div className='flex gap-2 justify-between items-center'>

                <Link to={`/profile/${post.userId}`} className='flex gap-2 items-center'>
                    <img className='rounded-full h-10 w-10' src="https://static.intercomassets.com/avatars/4439477/square_128/Glasses_Blue-1614106445.png" alt="avatar" />
                    <div className='flex flex-col'>
                        <h1 className='text-lg'>{post.userName ? post.userName : 'lorem ipsum'}</h1>
                        <span className='text-gray-400 text-md'><TimeAgo datetime={post.createdAt} /></span>
                    </div>
                </Link>
                <div className='relative'>
                    <span onClick={() => setOptions(prev => !prev)} className='text-xl font-bold cursor-pointer'>...</span>
                    {options && <div className='absolute right-3 bg-blue-200 shadow-lg p-10 border rounded-md flex flex-col gap-3 items-center'>
                        {post.userId === user._id && <span onClick={() => deletePost(dispatch, post._id)} className='font-bold text-blue-600 rounded cursor-pointer' >Delete</span>}
                        <span className=' font-bold text-blue-600 rounded cursor-pointer' >Share</span>
                    </div>
                    }
                </div>
            </div>
            <span className='mt-2'>{post.desc}</span>
            {post.imgUrl ? <img className='object-contain h-[400px]' src={process.env.REACT_APP_PUBLIC_FOLDER + post.imgUrl} alt="post" /> : null}
            <div className='flex justify-evenly'>
                <span className='mt-2 text-gray-800'>{post.likes.length !== 0 ? post.likes.length : 0} likes</span>
                <span className='mt-2 text-gray-800'>{comments.length !== 0 ? comments.length : 0} comments</span>
            </div>
            <hr className='mt-2' />
            <div className='flex justify-evenly mt-2'>

                <div onClick={() => post.likes.includes(user._id) ? handledisLike(dispatch, post._id, user._id) : handleLike(dispatch, post._id, user._id)} className={`cursor-pointer ${post.likes.includes(user._id) ? `font-bold text-blue-600` : ``}`}>{post.likes.includes(user._id) ? "Liked" : "Like"} </div>
                <div className='cursor-pointer'>Comment</div>
            </div>
        </div>
    )
}

export default Posts