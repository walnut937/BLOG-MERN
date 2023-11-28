import React, { useContext } from 'react'
import InputComponent from '../components/InputComponent'
import googlelogo from '../imgs/google.png'
import { Link, Navigate } from 'react-router-dom'
import Pageanimation from '../common/Pageanimation'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import { storeInSession } from '../common/session'
import { Usercontext } from '../App'
import { authWithGoogle } from '../common/firebase'

function UserAuthFormpage({ type }) {


    let { userAuth: { access_token }, setUserAuth } = useContext(Usercontext);


    const userAuthThroughServer = (serverRoute, formdata) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formdata)
        .then(({ data }) => {
            storeInSession("user", JSON.stringify(data));
            console.log(data)
            setUserAuth(data)
            toast.success(type == 'Sign In' ? "Successfully LoggedIn" : "Successfully created");
        })
        .catch(({ response }) => {
            toast.error("not found");
        })
    }

    const handleGoogleAuth = async(e) => {
        e.preventDefault();
        await authWithGoogle()
        .then(user => {
            let serverRoute = '/google-auth'
            console.log(user.accessToken)
            let formdata = {
                access_token : user.accessToken
            }
            userAuthThroughServer(serverRoute, formdata)
        })
        .catch(err => {
            toast.error("not getting")
        })
    }
    
    const handlesubmit = (e) => {
        e.preventDefault();
        let serverRoute = type == "Sign In" ? '/signin' : '/signup';
        let form = new FormData(formElement);
        let formdata = Object.fromEntries(form.entries());

        // for(let [key, value] of form.entries()){
        //     formdata[key] = value;
        // }
        
        //validation
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        let { fullname, email, password } = formdata;


        if (fullname && fullname.length < 3) {
            return toast.error("Full name must be 3 letters long" );
        }
        
        if(!email.length){
            return toast.error("Please enter your email address")
        }
    
        if(!emailRegex.test(email)){
            return toast.error("Email is invalid")
        }
    
        if(!passwordRegex.test(password)){
            return toast.error("Password must contain 1 Uppercase, 1 lowercases and 1 numbers and 6 - 20 characters long")
        }

        userAuthThroughServer(serverRoute, formdata);

    }
  return (
    access_token ? 
    <Navigate to="/" />
    :
    <Pageanimation keyvalue={ type }>
        <section className='h-cover flex items-center justify-center text-center'>
            <Toaster />
            <form id='formElement' className='w-[400px]'>
                <h1 className='text-3xl font-bold mb-10'>{type == 'Sign In' ? 'Welcome' : 'Join Us Today'}</h1>
                {
                    // name
                    type !== 'Sign In' ? 
                    <InputComponent
                        name="fullname"
                        type="text"
                        placeholder="Full Name"
                        icon="fi fi-sr-user"
                    /> 
                    : ''
                }
                    {/* email */}
                    <InputComponent
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi fi-sr-at"
                    />

                    {/* password */}
                    <InputComponent
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi fi-rr-key"
                        pass1="fi fi-rr-eye-crossed"
                        pass2="fi fi-rr-eye"
                    />

                    {/* signup and signin button */}
                    <button onClick={handlesubmit} className='bg-black text-white px-3 py-2 rounded-xl mt-5'>{type}</button>

                    {/* or UI */}
                    <div className='flex items-center gap-3 mt-5 center justify-center'>
                        <div className='w-40 bg-grey h-0.5'></div>
                        <h1 className='text-sm text-dark-grey'>OR</h1>
                        <div className='w-40 bg-grey h-0.5'></div>
                    </div>

                    {/* googleLogin */}
                    <div onClick={handleGoogleAuth} className='flex cursor-pointer bg-black text-white w-[250px] m-auto p-3 rounded-2xl mt-5 items-center justify-center gap-3'>
                        <img src={googlelogo} alt="google logo" className='w-6 h-6' />
                        <h1>Continue with Google</h1>
                    </div>

                    {/* toggle sign in & sign up */}
                    {
                        type == 'Sign In' ? 
                        <p className='mt-5'>Don't have and account? <Link to="/signup" className='underline'>Join us today</Link></p>
                        : <p className='mt-5'>Already a member? <Link to="/signin" className='underline'>Sign in here</Link></p>
                    } 
            </form>
        </section>
    </Pageanimation>
  )
}

export default UserAuthFormpage