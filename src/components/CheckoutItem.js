import React, { useContext, useState } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { StateContext } from '../StateProvider';
import { motion, AnimatePresence } from 'framer-motion';

function CheckoutItem({ item }) {
    const [value, setValue] = useState(item?.quantity);
    const { dispatch } = useContext(StateContext);

    const handleChange = (e) => {
        setValue(e.target.value);
        if (e.target.value !== '') {
            dispatch({
                type: 'UPDATE_QUANTITY',
                data: { id: item.id, qty: +e.target.value }
            })
        }
    };

    function deleteProduct() {
        dispatch({
            type: 'DELETE_FROM_BASKET',
            id: item.id
        })
    }

    return (
        <AnimatePresence>
            <motion.div key={item.id} whileHover={{ scale: .98 }} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: .3 }} layout className="bg-white px-1 md:px-2 py-[0rem] md:py-[.2rem] font-bold rounded border relative mt-[.6rem]" style={{ width: '100%' }}>
                <div className="flex flex-row items-center">
                    <div className="flex justify-center mt-[.5rem] md:mt-[.1rem] w-[190px] h-[130px] md:h-[130px]" >
                        <img src={item?.image} alt="" className='object-contain w-[150px]' />
                    </div>
                    <div className="py-1 px-[.1rem] md:px-[1rem]" style={{ flex: 1 }}>
                        <h5 className="font-normal text-sm md:text-md text-ellipsis line-clamp-3">{item?.title}</h5>
                        <h5 className="font-bold text-sm md:text-md mt-1"><small>₹ </small><strong>{item?.price?.toFixed(2)}</strong></h5>
                        <p className="mt-[.3rem] flex">
                            {Array.from({ length: item?.rating }).map((_) => {
                                return <p>⭐</p>
                            })}
                        </p>
                        <span className="mt-1 inline-block">
                            <span className="text-sm">Qty:</span> <input type="number" min="1" onChange={handleChange} className="border-2 p-[.2rem]" value={value} style={{ width: '5rem', marginLeft: '.5rem' }} />
                        </span>
                        <div className="text-[1.1rem] absolute" style={{ right: '1.5rem', top: '50%', transform: 'translateY("-50%")' }}>
                            <FaTrashAlt className='text-color2 cursor-pointer' onClick={deleteProduct} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default CheckoutItem