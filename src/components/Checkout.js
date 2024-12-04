import React, { useContext, useEffect } from 'react'
import Subtotal from './Subtotal'
import { StateContext } from '../StateProvider';
import CheckoutItem from './CheckoutItem';
import {
    SwipeableList,
    SwipeableListItem,
    TrailingActions,
    SwipeAction,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { useHistory } from 'react-router-dom';

function Checkout() {
    const { state, dispatch } = useContext(StateContext);
    const history = useHistory();

    useEffect(() => {
        // console.log('Checkout', state?.user);
        // if (!state?.user?.email) {
        //     console.log(state?.user?.email)
        //     history.push('/')
        // }
    }, [])

    function deleteItem(id) {
        dispatch({
            type: 'DELETE_FROM_BASKET',
            id: id
        })
    }

    const trailingActions = (id) => (
        <TrailingActions>
            <SwipeAction
                destructive={true}
                onClick={() => deleteItem(id)}
            >
                <div style={{ backgroundColor: '#cd9042', padding: '20px', color: 'black', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Delete</div>
            </SwipeAction>
        </TrailingActions>
    );

    function handleLogin() {
        history.replace('/login', { type: 'checkout' });
    }

    return (
        <>
            {state.user ? <div className="w-[100%] h-[90%] flex flex-col lg:flex-row gap-1 p-[.7rem] bg-color3 cursor-pointer">
                <div className="checkout__left h-[100%] flex flex-col" style={{ flex: '.7' }}>
                    <img className="mb-1" src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg" alt="" />
                    <div className='border-b-2 pb-1'>
                        <h3 className="font-medium">Hello, {state?.user?.email ? state?.user?.email : 'Guest'}</h3>
                        <h2 className='text-lg md:text-xl font-bold'>Your shopping Cart</h2>
                    </div>
                    {state.basket.length > 0 && <div className='grow rounded flex flex-col sticky bg-white py-[.4rem]' style={{ overflowY: 'auto' }}>
                        <SwipeableList>
                            {state.basket.map((item) => (
                                <SwipeableListItem
                                    key={item.id}
                                    trailingActions={trailingActions(item.id)}
                                >
                                    <CheckoutItem key={item.id} item={item} />
                                </SwipeableListItem>
                            ))}
                        </SwipeableList>
                    </div>
                    }
                    {state.basket.length === 0 && <div className=' text-center mt-2'><span className='font-bold text-lg'>No products</span></div>}
                </div>
                <div className="checkout__right" style={{ flex: '.3' }}>
                    <div className="sticky bg-color3" style={{ top: '3.5rem', zIndex: 100 }}>
                        <Subtotal />
                    </div>
                </div>
                <p className="fixed text-center text-xs md:text-sm" style={{ bottom: '.5rem', left: 0, right: 0 }}>© 2024 [<span className="font-bold text-md">Developed by: Muthuraj Marvar</span>]. All rights reserved. This project is a personal portfolio piece. Please contact me before reusing any part of it.</p>
            </div>
                : <div className="text-center mt-2"><button onClick={handleLogin} className='p-2 py-[.3rem] font-bold rounded text-black bg-color2 text-lg'>Login</button></div>}
        </>
    )
}

export default Checkout