import React, { useContext, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { auth, provider } from '../firebase';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { StateContext } from '../StateProvider';
import { FaGoogle } from "react-icons/fa";

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { type } = location.state || {};
    const { state } = useContext(StateContext);

    function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) {
            toast.warn("Email or Password missing.");
            return;
        }
        setLoading(true);
        auth
            .signInWithEmailAndPassword(email, password)
            .then(auth => {
                setLoading(false);
                if (type?.length > 0) {
                    if (type === 'checkout') {
                        let data = {
                            user: auth?.user?.uid,
                            basket: state?.basket
                        }
                        localStorage.setItem('amazonDetails', JSON.stringify(data));
                    }
                    history.replace(type);
                } else {
                    history.replace('/')
                }
                if ('speechSynthesis' in window) {
                    const speech = new SpeechSynthesisUtterance(`You are Logged in`);
                    window.speechSynthesis.speak(speech);
                } else {
                    alert('Speech Synthesis is not supported in your browser.');
                }
            })
            .catch(error => { setLoading(false); toast.warn(error.message); })
    }

    function handleRegister(e) {
        e.preventDefault();
        if (!email || !password) {
            toast.warn("Email or Password missing.");
            return;
        }
        setLoading(true);
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((auth) => {
                if (auth) {
                    setLoading(false);
                    if (type?.length > 0) {
                        let data = {
                            user: auth?.user?.uid,
                            basket: state?.basket
                        }
                        localStorage.setItem('amazonDetails', JSON.stringify(data));
                        history.replace(type);
                    } else {
                        history.replace('/')
                    }
                    if ('speechSynthesis' in window) {
                        const speech = new SpeechSynthesisUtterance(`You are logged in`);
                        window.speechSynthesis.speak(speech);
                    } else {
                        alert('Speech Synthesis is not supported in your browser.');
                    }
                }
            })
            .catch(error => { setLoading(false); toast.warn(error.message); })
    }

    const signInWithGoogle = async () => {
        try {
            const res = await auth.signInWithPopup(provider);
            if (res) {
                setLoading(false);
                if (type?.length > 0) {
                    let data = {
                        user: res?.user?.uid,
                        basket: state?.basket
                    }
                    localStorage.setItem('amazonDetails', JSON.stringify(data));
                    history.replace(type);
                } else {
                    history.replace('/')
                }
                if ('speechSynthesis' in window) {
                    const speech = new SpeechSynthesisUtterance(`You are logged in`);
                    window.speechSynthesis.speak(speech);
                } else {
                    alert('Speech Synthesis is not supported in your browser.');
                }
            }
        } catch (error) {
            console.log(error => { setLoading(false); toast.warn(error.message); });
        }
    };

    return (
        <div style={{ height: '100vh', width: '100vw' }} className='bg-color3 flex items-start justify-center p-[.5rem]'>
            <div className="bg-white py-2 px-1 w-[95%] lg:w-[27%] mt-5 rounded">
                <Link to='/' className='flex items-start justify-center p-1'>
                    <img style={{ width: '7rem' }} className='object-cover' src="https://assets.aboutamazon.com/dims4/default/c7f0d8d/2147483647/strip/true/crop/6110x2047+0+0/resize/645x216!/format/webp/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2F2e%2Fd7%2Fac71f1f344c39f8949f48fc89e71%2Famazon-logo-squid-ink-smile-orange.png" alt="" />
                </Link>
                <form className="flex flex-col items-start px-1">
                    <h1 className="text-xl mt-[.8rem] font-bold">Sign In</h1>
                    <label htmlFor="email" className="text-md mt-[.7rem] font-bold">E-mail</label>
                    <input id="email" type="email" className='mt-1 w-[100%] border-2 p-1' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password" className="text-md mt-[.8rem] font-bold">Password</label>
                    <input id="password" type="password" className='mt-1 w-[100%] border-2 p-1' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="bg-color2 p-1 mt-2 w-[100%] font-bold rounded" type="submit" onClick={handleSubmit} >Sign In</button>
                    <button className="bg-color2 p-1 mt-1 w-[100%] font-bold rounded" type="submit" onClick={handleRegister} >Register</button>
                    <div className="border-2 border-1 rounded flex items-center justify-center w-[100%] mt-1 p-1 font-bold cursor-pointer" onClick={signInWithGoogle}>
                        <FaGoogle className='text-2xl cursor-pointer mr-1 font-bold' /> <span className='font-bold'>Sign in with Google</span>
                    </div>
                </form>
                <p className="fixed text-center text-xs md:text-sm" style={{ bottom: '1rem', left: 0, right: 0 }}>© 2024 [<span className="font-bold text-md">Developed by: Muthuraj Marvar</span>]. All rights reserved. This project is a personal portfolio piece. Please contact me before reusing any part of it.</p>
            </div>
            {loading && <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <LinearProgress color="inherit" />
            </Stack>}
        </div>
    )
}

export default Login;