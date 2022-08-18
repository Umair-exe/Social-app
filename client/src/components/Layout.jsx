import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../redux/userSlice'
import { checkUser } from '../utlis/checkUser'
import Navbar from './Navbar'
import RightSide from './RightSide'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!checkUser()) {
            dispatch(logout())
            navigate('/')
        }
    }, [])
    return (
        <>

            <Navbar />

            <div className='flex justify-between'>
                <div className='hidden 2xl:inline-flex 2xl:flex-[0.32] xl:inline-flex xl-flex-[0.3] lg:inline-flex lg:flex-[0.3] md:inline-flex md:flex-[0.2] relative font-bold ' >
                    <div className='fixed '>
                        <Sidebar />
                    </div>
                </div>
                <div className='2xl:flex-[0.35] xl:flex-[0.4] lg:flex-[0.4] md:flex-[0.8] flex-1 px-5 '>
                    {children}
                    <Outlet />
                </div>
                <div className='hidden 2xl:inline-flex 2xl:flex-[0.32] xl:inline-flex xl-flex-[0.3] lg:inline-flex lg:flex-[0.3]  relative ' >
                    <div className='fixed right-20'>
                        <RightSide />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Layout