import React, { useContext, useEffect, useState } from 'react'
import { StateContext } from '../StateProvider';
import { toast } from "react-toastify";
import { motion } from 'framer-motion';

function Product({ id, title, price, image, rating }) {
    const { state, dispatch } = useContext(StateContext);
    const [triggerAnimation, setTriggerAnimation] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        setTriggerAnimation(!triggerAnimation);
    }, [title]);

    function addToBasket() {
        let product = state.basket.find((item) => item?.id === id);
        if (product) {
            toast.warn("Product already added to cart.");
        } else {
            setIsClicked(true)
            dispatch({
                type: 'ADD_TO_BASKET',
                item: {
                    id, title, price, image, rating
                }
            })
            // toast.success("Product added to cart.");
            toast(
                <div className="flex items-center">
                    <img src={image} alt="" style={{ height: '80px', width: '100px' }} className="object-contain" />
                    <p className="ml-1 line-clamp-3 text-green-600" style={{ fontSize: '.9rem' }}>Added {title}</p>
                </div>,
                {
                    autoClose: 1500
                }
            );
        }
    }

    return (
        <>
            <motion.div key={triggerAnimation} className={`bg-white p-1 md:px-2 py-[.8rem] font-bold rounded border cursor-pointer`} whileHover={{ scale: .95 }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                }}
            >
                <h5 className="font-bold text-sm md:text-md whitespace-nowrap overflow-hidden text-ellipsis">{title}</h5>
                <h5 className="font-bold text-sm md:text-md mt-1"><small></small><strong>{new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(price)}</strong></h5>
                <p className="mt-[.3rem] flex">
                    {Array.from({ length: rating }).map((_) => {
                        return <p>⭐</p>
                    })}
                </p>
                <div className="flex justify-center mt-[.9rem] h-[150px] md:h-[190px]">
                    <img src={image} alt="" loading="lazy" className='object-contain w-[100%]' />
                </div>
                <div className="flex justify-center mt-[.4rem] md:mt-[.6rem]">
                    <motion.button onClick={addToBasket} whileTap={{ scale: 0.9 }} transition={{ duration: .3 }} className='px-[.5rem] md:px-[1rem] py-[.25rem] md:py-[.4rem] bg-color2 text-black rounded-sm'>
                        Add to cart
                    </motion.button>
                </div>
            </motion.div >
        </>
    )
}

export default Product