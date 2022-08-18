import React from 'react'
import { Link, useParams } from 'react-router-dom'

const ProfileHeader = () => {
  const {id} = useParams();

  return (
    <div className='bg-white p-2 flex justify-evenly shadow-lg rounded mt-6'>
        <Link to={`/profile/${id}/followers`}><span className='text-xl text-gray-800 cursor-pointer'>Followers</span></Link>
        <Link to={`/profile/${id}/following`}><span className='text-xl text-gray-800 cursor-pointer'>Following</span></Link>
    </div>
  )
}

export default ProfileHeader