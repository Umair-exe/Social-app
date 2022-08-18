import React, { useEffect } from 'react'
import Posts from '../components/Posts'
import WritePost from '../components/WritePost'
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import { getPosts } from '../redux/apiCalls';


const Home = () => {
    const dispatch = useDispatch()
    const { posts, isloading } = useSelector(state => state.post);

    useEffect(() => {
        getPosts(dispatch)
        document.title = 'Feed';

        return () => document.title = 'Social App'
    }, [dispatch])



    return (
        <div>
            <WritePost />
            {isloading ? <div className='flex justify-center items-center '><Spinner /></div> : posts?.length !== 0 ? posts.map((post) => <Posts key={post._id} post={post} />) : <h1 className='text-3xl font-bold text-blue-600'>No posts</h1>}
    

        </div>
    )
}

export default Home