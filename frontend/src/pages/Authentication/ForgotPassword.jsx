import React, { useEffect, useState } from 'react'
import { HiOutlineMail } from "react-icons/hi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { LuUser } from "react-icons/lu";

function ForgotPassword() {
    const [user, setUser] = useState({ email: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    }

    const handleForm = (e) => {
        e.preventDefault();

        console.log("User Data: ", user);
    }
    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-between flex-col py-6 md:py-20"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div>
                <img src="logo.png" alt="Company Logo" loading="lazy" className="h-14" />
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg px-8 py-6 shadow border border-gray-200 p-4 m-4 w-md">
                <div className='font-semibold text-2xl mb-2'>Forget Password?</div>
                <div className='text-gray-500 mb-4 text-sm'>If you forgot your password, well, then we’ll email you instructions to reset your password.</div>
                <form onSubmit={handleForm}>
                    <div className='relative mb-3'>
                        <label className='block mb-2' htmlFor="email">Email Address<span className='text-red-500 pl-1'>*</span></label>
                        <input
                            type="email"
                            name='email'
                            onChange={handleChange}
                            autoComplete="email"
                            value={user.email}
                            id='email'
                            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-14  text-sm text-gray-700 placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none' />
                        <span className="absolute right-3 bottom-2 rounded-md px-2 py-1 text-lg font-medium text-gray-500"><HiOutlineMail /></span>
                    </div>


                    <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3" type='submit'
                    >Sign Up</button>
                    <div className='text-center text-sm text-gray-500 mb-3'>
                        Return to <Link to={'/login'} className='text-dark'>Login</Link>
                    </div>
                </form>
            </div>
            <div className='text-sm text-gray-500'>Copyrights © {new Date().getFullYear()} - <Link to={'/'}>VyapaarSetu</Link></div>
        </div>
    )
}

export default ForgotPassword