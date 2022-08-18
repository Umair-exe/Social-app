import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const { user } = useSelector(state => state.user);
    return (
        <div className='relative p-4 mt-3 w-[200px]' >
            <div className='absolute  space-y-6 '>
                <Link className=' flex gap-2 items-center cursor-pointer ' to={`profile/${user._id}`}>
                    <img className='h-10 w-10 object-contain rounded-full cursor-pointer' src={user?.profileimg ? process.env.REACT_APP_PUBLIC_FOLDER + user.profileimg : "https://static.intercomassets.com/avatars/4439477/square_128/Glasses_Blue-1614106445.png"} alt="profile Image" />
                    <span className='text-justify'>{user.name}</span>
                </Link>

                <div className='flex gap-2 items-center cursor-pointer'>
                    <img className='h-10 w-10 object-contain rounded-full cursor-pointer' src='https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/S0U5ECzYUSu.png?_nc_eui2=AeGKJIsaAzABscCRbIICTSSdqfpKmA4GtxSp-kqYDga3FLH-cMMA1WRZKeCj5y7iwaZO65PFUnvwsDs2hXlMLOF8' alt="" />
                    <span>Pages</span>
                </div>

            </div>
        </div >
    )
}

export default Sidebar