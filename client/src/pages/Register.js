import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { responseCame, start, } from '../redux/appSlice';

const Register = () => {
    const nameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isloading } = useSelector(state => state.app);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        handleRegister(data);

    }
    const handleRegister = async (data) => {
        try {
            dispatch(start());
            const res = await axios.post(process.env.REACT_APP_API_URL + '/auth/register', data);
            if (res) {
                dispatch(responseCame());
                setMessage(res.data);
                nameRef.current.value= '';
                emailRef.current.value= '';
                passwordRef.current.value= '';
                navigate('/',{replace:true});
            }
        } catch (error) {
            dispatch(responseCame());
            setMessage(error.response.data.message)
        }

    }

    return (
        <div className='flex justify-center items-center mt-20 '>
            <div className='bg-gray p-14 shadow-xl w-[500px] bg-white rounded-md'>
                <form className='flex justify-center items-center flex-col p-6 gap-5 '>
                    <h1 className='font-bold text-2xl text-blue-600'>Register</h1>
                    <input type='text' ref={nameRef} className=' p-2 w-full border border-blue-400' placeholder="Name" />
                    <input type='email' ref={emailRef} className=' p-2 w-full border border-blue-400' placeholder="Email" />
                    <input type='password' ref={passwordRef} className=' p-2 w-full border border-blue-400' placeholder="password" />
                    <button type='submit' onClick={handleSubmit} className='p-2 w-full bg-blue-600 text-white' >Register</button>
                    <h1>Already have an account? <Link to='/'> <span className='font-bold text-blue-600'>Login</span></Link></h1>
                   
                    {isloading && <Spinner />}
                </form>
                {message?.length !== 0 && <h1 className='text-xl font-bold text-blue-600 text-center'>{message}</h1>}
            </div>
        </div>
    )
}

export default Register