import React, { useContext, useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { StateContext } from '../StateProvider';
import { getTotalAmount, getTotalItem } from '../reducer';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';

function Subtotal() {
    const history = useHistory();
    const { state, } = useContext(StateContext);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (state.basket.length > 0) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 500);
        }
    }, [state.basket]);

    return (
        <div className="p-[1.5rem] bg-white rounded">
            <CurrencyFormat
                renderText={(value) => (
                    <>
                        <p className="text-[1.1rem]">Subtotal ({state.basket.length} items,<motion.span animate={animate ? { y: [0, -8, 0] } : {}} transition={{ duration: 0.5 }}> {getTotalItem(state.basket)}</motion.span> Qty): <strong>₹{getTotalAmount(state.basket)?.toFixed(2)}</strong></p>
                        {/* <small style={{ display: 'block', marginTop: '.5rem', fontSize: '1rem' }}>
                            <input type="checkbox" /> This order contains a gift
                        </small> */}
                    </>
                )}
                decimalScale={2}
                value={0}
                displayType='text'
                thousandSeparator={true}
                prefix={'₹'}
            />
            <button className='rounded mt-2 w-[100%] bg-color2 py-1 font-bold' onClick={e => history.push('/payment')}>Proceed to Checkout</button>
        </div>
    )
}

export default Subtotal;