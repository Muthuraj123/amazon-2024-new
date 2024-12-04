import { Box, Modal } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FaSearch, FaMicrophone, FaShoppingCart, FaBars, FaRegUser, FaSignInAlt, FaSignOutAlt, FaTimes, FaMicrophoneSlash } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { StateContext } from '../StateProvider';
import { auth } from '../firebase';
import { motion } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const style = {
    position: "absolute",
    top: "38%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    py: 2,
    px: 1,
    fontFamily: "Oxygen",
    borderRadius: '.5rem'
};

function Header() {
    const [openModal, setOpenModal] = useState(false);
    const { state, dispatch } = useContext(StateContext);
    const { basket, user } = state;
    const [animate, setAnimate] = useState(false);
    const location = useLocation();

    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    function handleAuthentication() {
        if (user) {
            auth.signOut();
            dispatch({
                type: 'REMOVE_BASKET',
            });
            dispatch({
                type: 'LOGGED',
                logged: false
            });
            if ('speechSynthesis' in window) {
                const speech = new SpeechSynthesisUtterance(`You are logged off`);
                window.speechSynthesis.speak(speech);
            } else {
                alert('Speech Synthesis is not supported in your browser.');
            }
        }
    }

    function handleChange(e) {
        dispatch({
            type: 'UPDATE_SEARCH',
            search: e.target.value,
            listening: false
        });
    }

    useEffect(() => {
        if (basket.length > 0) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 500);
        }
    }, [basket]);

    useEffect(() => {
        dispatch({
            type: 'UPDATE_SEARCH',
            search: transcript
        });
    }, [transcript])

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className="sticky" style={{ top: 0, zIndex: 100 }}>
            <div className="flex items-center justify-between py-[.45rem] md:py-[.4rem] px-1 md:px-2 bg-color1 text-white">
                <Link to='/'>
                    <img src="http://pngimg.com/uploads/amazon/amazon_PNG11.png" alt="logo" className="h-2 w-3 md:w-5 cursor-pointer" />
                </Link>
                <div className="flex items-center text-black w-[62%] md:w-[50%]">
                    <input type="search" value={state.search} onChange={handleChange} style={{ width: '90%', borderRadius: '.2rem' }} placeholder='Search products' className="font-sm md:font-inherit font-bold p-[.2rem] md:p-[.3rem] ml-[.1rem] md:ml-[0rem]" />
                    <button className="p-[.35rem] md:p-[.45rem] bg-color2 text-black ml-1 rounded-sm group"><FaSearch className="font-bold text-lg transition-colors duration-300 group-hover:text-white" /></button>
                    {location?.pathname === '/' && <button className="p-[.35rem] md:p-[.45rem] bg-color2 text-black ml-1 rounded-sm group" onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening()}>{listening ? <FaMicrophoneSlash className="font-bold text-lg duration-200 group-hover:text-white" /> : <FaMicrophone className="font-bold text-lg duration-200 group-hover:text-white" />}</button>}
                </div>
                <div className="flex items-center">
                    <Link to={!user?.email ? '/login' : ''}>
                        <div onClick={handleAuthentication} className="items-center flex-col hidden md:flex">
                            <span className="text-xs">Hello, {user?.email ? user?.email : 'Guest'}</span>
                            <span className="font-bold text-sm cursor-pointer">{user?.email ? 'Sign Out' : 'Sign In'}</span>
                        </div>
                    </Link>
                    <Link to='/orders'>
                        <div className="items-center flex-col ml-1 md:ml-2 hidden md:flex">
                            <span className="text-xs">Returns</span>
                            <span className="font-bold text-sm cursor-pointer">& Orders</span>
                        </div>
                    </Link>
                    <Link to='/checkout'>
                        <motion.div className='ml-1 md:ml-2 relative cursor-pointer' animate={animate ? { y: [0, -8, 0] } : {}} transition={{ duration: 0.5 }}>
                            <span><FaShoppingCart className="font-bold text-xl" /></span>
                            <span className='text-sm md:text-md absolute' style={{ top: '-.8rem', right: '-.5rem' }}>{basket.length}</span>
                        </motion.div>
                    </Link>
                    {state.user && <FaBars className="font-bold text-lg ml-[1rem] md:ml-2 md:hidden" onClick={() => setOpenModal(true)} />}
                    {!state.user &&
                        <Link to={'/login'}>
                            <FaRegUser className="font-bold text-lg ml-[1rem] md:ml-2 md:hidden" onClick={() => setOpenModal(true)} />
                        </Link>
                    }
                </div>
            </div>
            {openModal && (
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal((prev) => !prev)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{ fontFamily: "Oxygen" }}
                >
                    <Box sx={style} className="flex flex-col items-center relative">
                        <FaTimes className='absolute text-xl' style={{ top: '.5rem', right: '.5rem' }} onClick={() => setOpenModal(false)} />
                        <span className='mt-[.5rem] font-bold text-lg flex items-center'>{state?.user?.email ? <span className='flex items-center'><FaRegUser className='mr-1' /> {state?.user?.email}</span> : <span><FaSignInAlt className='mr-1' /> Sign In</span>}</span>
                        <Link to='/orders'><span className='mt-[1.2rem] font-bold text-lg flex items-center'><FaShoppingCart className='mr-1' />Orders</span></Link>
                        <Link to={'/login'}>
                            {user.email && <span className='mt-[1.2rem] font-bold text-lg flex items-center' onClick={handleAuthentication}><FaSignOutAlt className='mr-1' />Signout</span>}
                        </Link>
                    </Box>
                </Modal>
            )
            }
        </div>
    )
}

export default Header