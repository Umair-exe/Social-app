import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import { deleteToken } from '../utlis/logout';

const Navbar = () => {
    const [options, setOptions] = useState(false);
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();
    const searchRef = useRef('');
    const ref = useRef(null);

    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchRef.current.value.length === 0) return
        navigate(`/search/${searchRef.current.value}`)

    }
    useEffect(() => {
        const handleMouseLeaving = (e) => {
            if(ref.current && !ref.current.contains(e.target)) {
                setOptions(false);
            }
        }

        window.addEventListener('mousedown',handleMouseLeaving);

        return () => window.removeEventListener('mousedown',handleMouseLeaving)

    },[])
    return (
        <div ref={ref} className='top-0 z-20 sticky'>
            <div className='flex justify-between items-center p-2 bg-white  shadow-md relative'>
                <Link to='/'><div className='text-xl font-bold text-blue-600'>Logo</div></Link>
                <div>
                    <form onSubmit={handleSubmit} >
                        <input type="text" ref={searchRef} name="search" placeholder='Search a friend' className=' p-2 px-6  md:inline-flex md:w-[300px] lg:w-[600px] rounded-full bg-gray-100 outline-none ' />
                        <input type="submit" hidden />
                    </form>
                </div>

                <div onClick={() => setOptions(!options)} >
                    <img className='h-10 w-10 object-contain rounded-full cursor-pointer' src={user?.profileimg ? process.env.REACT_APP_PUBLIC_FOLDER + user.profileimg : "https://static.intercomassets.com/avatars/4439477/square_128/Glasses_Blue-1614106445.png"} alt="Profile" />
                </div>

                {options && <div className='p-10 bg-white border rounded shadow-xl absolute right-10 top-12 z-40 '>
                    <div className='flex flex-col gap-3 font-bold p-2 text-gray-700 '>
                        <Link to={`/profile/${user._id}`} className='hover:bg-gray-200 p-2 px-6 hover:rounded'>
                            <h1 className='cursor-pointer '>Profile</h1>
                        </Link>
                        <div className='hover:bg-gray-200 p-2 px-6 hover:rounded' onClick={() => {
                            deleteToken();
                            dispatch(logout())
                            localStorage.removeItem('persist:root');
                            navigate('/')
                        }}>
                            <h1 className=' cursor-pointer '>Logout</h1>
                        </div>
                    </div>
                </div>
                }
            </div>

        </div>
    )
}

export default Navbar