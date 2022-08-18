import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../redux/apiCalls';

const WritePost = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [file, setFile] = useState('');
    console.log(file)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            userName: user.name,
            desc: search,

        }
        const formData = new FormData();
        if (file) {
            const filename = Date.now() + file.name;
            formData.append('name', filename);
            formData.append('file', file);
            data.imgUrl = "uploads/" + filename;


            try {
                const res = await axios.post(process.env.REACT_APP_API_URL + '/upload', formData, {
                    'Content-type': 'multipart/form-data '
                });
            } catch (error) {
                console.log(error);
            }
        }
        try {
            const res2 = await axios.post(process.env.REACT_APP_API_URL + '/post/newPost', data, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            })
            setSearch('');
            setFile('');
            if (res2) return getPosts(dispatch)
        } catch (error) {
            console.log(error.response.data.message);
        }

    }

    return (
        <div>
            <div className='flex flex-col gap-3 justify-center p-4 shadow-md mt-6 rounded mb-10 bg-white'>
                <input type="text" value={search} onChange={e => {
                    setSearch(e.target.value)
                    if (search.length === 1) {
                        setFile('');
                    }
                }} placeholder='Write Something' className=' p-6 w-full rounded-md bg-gray-100 outline-none ' />
                {search.length !== 0 && <>
                    <label htmlFor='file' className='flex mt-4' >
                        <input type="file"
                            name='file'
                            className={`block w-full file:mr-4 file:p-2 file:px-6 file:rounded-full file:border-0 file:font-bold file:bg-blue-200 file:text-blue-600`}
                            onChange={e => setFile(e.target.files[0])} accept='.png,.jpg,.jpeg' />
                    </label>
                    <button onClick={handleSubmit} className='p-2 bg-blue-600 text-white rounded'>Upload Post</button>
                </>}
                {file ? <img src={URL.createObjectURL(file)} /> : null}
            </div>
        </div>
    )
}

export default WritePost