import React, { useEffect, useState } from 'react'
import { HiOutlineMail } from "react-icons/hi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import axios from 'axios';
import Input from "../../components/UI/Input";
import { useAlert } from "../../components/UI/AlertProvider";

function Register() {
    const navigate = useNavigate();
    const [register, setRegister] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { notify } = useAlert();

    const handleShowPassword = () => {
        setShowPassword(prev => !prev);
    }
    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(prev => !prev);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegister((prev) => ({ ...prev, [name]: value }));
    }

    const handleRememberMe = (e) => {
        setRemember(e.target.checked);
    }

    const handleForm = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmpassword } = register;

        if (!name || !email || !password || !confirmpassword) {
            notify({
                type: "warning",
                title: "Missing fields",
                message: "All fields are required.",
            });
            return;
        }
        if (password !== confirmpassword) {
            notify({
                type: "warning",
                title: "Password mismatch",
                message: "Password does not match.",
            });
            return;
        }

        try {
            const payload = {
                email,
                password,
                name,
                role: "admin",
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/signup`,
                payload,
            );
            localStorage.setItem("token", data.token);
            if (data.refreshToken) {
                localStorage.setItem("refresh_token", data.refreshToken);
            }
            localStorage.setItem("user", JSON.stringify(data.user));
            axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
            if (remember) {
                localStorage.setItem("register", JSON.stringify(register));
            }
            else {
                localStorage.removeItem("register");
            }

            console.log("Signup Success: ", data);

            notify({
                type: "success",
                title: "Account created",
                message: "Your account was created successfully.",
            });
            navigate("/store-setup");
        } catch (error) {
            const message = `Signup Error: ${error.response?.data?.message}` || "Registration failed";
            console.error("Signup Error: ", message);
            notify({
                type: "error",
                title: "Signup failed",
                message,
            });
        }




    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!token || !user) return;
        if (!user.storeId) return navigate("/store-setup");
        if (!user.subscriptionActive) return navigate("/pricing");
        return navigate("/");
    }, [navigate]);

    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-between flex-col py-6 md:py-8"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div>
                <img src="logo.png" alt="Company Logo" loading="lazy" className="h-14" />
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg px-8 py-6 shadow border border-gray-200 p-4 m-4 w-md">
                <div className='font-semibold text-2xl mb-2'>Register</div>
                <div className='text-gray-500 mb-4 text-sm'>Create New VyapaarSetu Account</div>
                <form onSubmit={handleForm}>
                    <div className='relative mb-3'>
                        <label className='block mb-2' htmlFor="name">Name<span className='text-red-500 pl-1'>*</span></label>
                        <Input
                            type="text"
                            name='name'
                            onChange={handleChange}
                            autoComplete="name"
                            value={register.name}
                            id='name'
                            className="pr-14"
                        />
                        <span className="absolute right-3 bottom-2 rounded-md px-2 py-1 text-lg font-medium text-gray-500"><LuUser /></span>
                    </div>
                    <div className='relative mb-3'>
                        <label className='block mb-2' htmlFor="email">Email Address<span className='text-red-500 pl-1'>*</span></label>
                        <Input
                            type="email"
                            name='email'
                            onChange={handleChange}
                            autoComplete="email"
                            value={register.email}
                            id='email'
                            className="pr-14"
                        />
                        <span className="absolute right-3 bottom-2 rounded-md px-2 py-1 text-lg font-medium text-gray-500"><HiOutlineMail /></span>
                    </div>
                    <div className='relative mb-3'>
                        <label className='block mb-2' htmlFor="password">Password<span className='text-red-500 pl-1'>*</span></label>
                        <Input
                            type={`${showPassword === false ? "password" : "text"} `}
                            value={register.password}
                            name="password"
                            onChange={handleChange}
                            id='password'
                            autoComplete="current-password"
                            className="pr-14"
                        />
                        <span onClick={handleShowPassword} className="absolute right-3 bottom-2 rounded-md px-2 py-1 text-lg font-medium text-gray-500 cursor-pointer">
                            {showPassword === false ? <FiEye /> : <FiEyeOff />}
                        </span>
                    </div>
                    <div className='relative mb-3'>
                        <label className='block mb-2' htmlFor="confirmpassword">Confirm Password<span className='text-red-500 pl-1'>*</span></label>
                        <Input
                            type={`${showConfirmPassword === false ? "password" : "text"} `}
                            value={register.confirmpassword}
                            name="confirmpassword"
                            onChange={handleChange}
                            id='confirmpassword'
                            autoComplete="current-password"
                            className="pr-14"
                        />
                        <span onClick={handleShowConfirmPassword} className="absolute right-3 bottom-2 rounded-md px-2 py-1 text-lg font-medium text-gray-500 cursor-pointer">
                            {showConfirmPassword === false ? <FiEye /> : <FiEyeOff />}
                        </span>
                    </div>
                    <div className='flex justify-between items-center mb-3'>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" id="rememberme" onChange={handleRememberMe} className="peer hidden" />
                            <div
                                className=" h-4 w-4 rounded border border-gray-200 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20"
                            >
                                <svg
                                    className="h-3 w-3 text-white peer-checked:block"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span className="text-sm text-gray-700">
                                I agree to the <Link to={'/'} className='text-primary'>Terms & Privacy</Link>
                            </span>
                        </label>
                        {/* <div className='text-sm text-red-500'><Link to={'/'}>Forgot Password?</Link></div> */}
                    </div>
                    <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3" type='submit'
                    >Sign Up</button>
                    <div className='text-sm text-gray-500 mb-3'>
                        New on our platform? <Link to={'/login'} className='text-dark'>Sign In Instead</Link>
                    </div>
                    <div className='text-sm text-gray-500 text-center mb-3'>
                        - OR -
                    </div>
                    <div className="mb-4 flex justify-center gap-4">
                        <Link
                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1877F2] text-white transition-all duration-200 hover:bg-[#1877F2]/90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1877F2]/30">
                            <FaFacebook className="text-xl" />
                        </Link>
                        <Link
                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-gray-200 text-[#DB4437] transition-all duration-200 hover:bg-[#DB4437]/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DB4437]/30">
                            <FaGoogle className="text-xl" />
                        </Link>

                        <Link className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white transition-all duration-200 hover:bg-black/90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black/30">
                            <FaApple className="text-xl" />
                        </Link>
                    </div>
                </form>
            </div>
            <div className='text-sm text-gray-500'>Copyrights © {new Date().getFullYear()} - <Link to={'/'}>VyapaarSetu</Link></div>
        </div>
    )
}

export default Register
