import React, { useContext, useEffect, useRef, useState } from 'react'
import { StateContext } from '../StateProvider';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getTotalAmount, getTotalItem } from '../reducer';
import axios from '../axios';
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import { LinearProgress, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

function MapUpdater({ position }) {
    const map = useMap();
    React.useEffect(() => {
        if (position) {
            map.setView([position.lat, position.lng], 15); // Pan and zoom the map
        }
    }, [map, position]);

    return null;
}

function Payment() {
    const history = useHistory();
    const { state, dispatch } = useContext(StateContext);
    const { user, basket } = state;
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);
    const [receiverName, setReceiverName] = useState('');
    const [line1, setLine1] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const paymentRef = useRef(null);
    const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
    const [zoom, setZoom] = useState(13);

    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    fetchAddress(latitude, longitude);
                },
                (error) => {
                    // setError(error.message);
                },
                {
                    enableHighAccuracy: true, // Enable high accuracy mode
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            // setError('Geolocation is not supported by this browser.');
        }
    }, []);

    React.useEffect(() => {
        let timer = setTimeout(() => {
            handleSearch();
        }, 700);
        return () => {
            clearTimeout(timer);
        };
    }, [line1]);

    const handleSearch = async () => {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: line1 });

        if (results && results.length > 0) {
            const { x, y } = results[0];
            setLocation({ lat: y, lng: x });
            setZoom(15);
        }
    };

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setLine1(
                    data.address.road ? data.address.road : data.address.city
                );
                // setAddress(data.display_name); // Get the formatted address
            } else {
                // setError('Unable to fetch address');
            }
        } catch (err) {
            // setError('Error fetching address');
        }
    };

    useEffect(() => {
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getTotalAmount(basket) * 100}&receiverName=${receiverName}&line1=${line1}&city=${city}&pincode=${pincode}&country=${country}`
            });
            if (paymentRef.current) {
                paymentRef.current.focus();
                paymentRef.current.scrollIntoView({
                    behavior: 'smooth',
                });
            }
            setClientSecret(response.data.clientSecret);
        }
        if (state.user && submitted) {
            getClientSecret();
        }
    }, [submitted]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        console.log(clientSecret)

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        })

        const { paymentIntent } = payload;

        if (payload.error) {
            // Payment failed
            setError(`Payment failed: ${payload.error.message}`);
            setProcessing(false);
        } else {

            const data = {
                user: user?.uid,
                orderId: paymentIntent.id,
                receiverName,
                line1,
                city,
                pincode,
                country,
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created
            };

            const response = await axios({
                method: 'post',
                url: `/orders/create`,
                data
            });

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'REMOVE_BASKET',
            });

            let data1 = {
                user: state?.user?.uid,
                basket: []
            }
            localStorage.setItem('amazonDetails', JSON.stringify(data1));

            if ('speechSynthesis' in window) {
                const speech = new SpeechSynthesisUtterance(`payment done order accepted`);
                window.speechSynthesis.speak(speech);
            } else {
                alert('Speech Synthesis is not supported in your browser.');
            }

            toast.success("Order done.");

            // Redirect to orders page or another route
            history.replace('/orders');
        }
    }

    const handleChange = e => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }

    function handleDetails() {
        if (!receiverName || !line1 || !city || !pincode || !country) {
            toast.warn("Add Delivery details.");
            return;
        }
        setSubmitted(prev => !prev);
    }

    function handleLogin() {
        history.replace('/login');
    }

    React.useEffect(() => {
        const DefaultIcon = L.icon({
            iconUrl: markerIcon,
            shadowUrl: markerShadow,
        });
        L.Marker.prototype.options.icon = DefaultIcon;
    }, []);

    return (
        <>
            {state.user ? state.basket.length > 0 ? <div className="bg-color3">
                <div className="bg-white p-1 md:p-2 py-1 flex flex-col">
                    <div>
                        {processing && <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2} style={{ position: 'fixed', top: '3.2rem', left: 0, right: 0, zIndex: 100 }}>
                            <LinearProgress color="inherit" />
                        </Stack>}

                        <h1 className="text-2xl font-bold">Checkout</h1>
                        <div className="flex md:items-center flex-col md:flex-row">
                            <div className="w-[100%] md:w-[30%]">
                                <div>
                                    <h3 className="text-sm mt-[.5rem] font-bold">Delivery address details:</h3>
                                </div>
                                <div className="flex flex-col mt-[.5rem]">
                                    <input type="text" value={receiverName} onChange={e => setReceiverName(e.target.value)} className="mt-[.3rem] p-[.2rem]  border-2" placeholder="Delivery Reciever name" />
                                    <input type="text" value={line1} onChange={e => setLine1(e.target.value)} className="mt-[.3rem] p-[.2rem]  border-2" placeholder="Line 1" />
                                    <input type="text" value={city} onChange={e => setCity(e.target.value)} className="mt-[.3rem] p-[.2rem]  border-2" placeholder="City" />
                                    <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="mt-[.3rem] p-[.2rem]  border-2" placeholder="Pin code" />
                                    <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="mt-[.3rem] p-[.2rem]  border-2" placeholder="Country" />
                                    <button className="p-1 bg-color2 text-black font-bold mt-1 rounded" onClick={handleDetails}>{submitted ? 'Submitted' : 'Submit'}</button>
                                </div>
                            </div>
                            <div className='mt-1 md:mt-0 md:ml-2 flex flex-col h-[250px] md:h-[295px] w-[100%] md:w-[500px]' >
                                {/* <div>
                                    <h3 className="text-sm mt-[.1rem] font-bold">Location:</h3>
                                </div> */}
                                <MapContainer
                                    center={[location.lat, location.lng]}
                                    zoom={zoom}
                                    style={{ height: "100%", width: "100%", zIndex: 2, marginTop: '.1rem' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                    />
                                    <Marker position={[location.lat, location.lng]}>
                                        <Popup>Location found: {line1}</Popup>
                                    </Marker>
                                    <MapUpdater position={location} />
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 mt-[1rem]" style={{ overflowX: 'auto' }}>
                        <div className="mt-1" style={{ flex: .6 }}>
                            <h3 className="text-sm font-bold">Review items and Delivery (Items: {state?.basket?.length})</h3>
                            {state?.basket?.length > 0 && <div className="rounded  border-2 p-1" style={{ height: '90%', overflowY: 'auto' }}>
                                {state.basket.map((item) => (
                                    <motion.div whileHover={{ scale: .98 }} transition={{ duration: .3 }} className="bg-white px-1 md:px-2 py-[0rem] md:py-[.2rem] font-bold rounded border relative mt-[.6rem]">
                                        <div className="flex flex-row items-center">
                                            <div className="flex justify-center mt-[.5rem] md:mt-[.1rem] w-[190px] h-[130px] md:h-[130px]" >
                                                <img src={item?.image} alt="" className='object-contain w-[150px]' />
                                            </div>
                                            <div className="py-1 px-[.1rem] md:px-[1rem]" style={{ flex: 1 }}>
                                                <h5 className="font-normal text-sm md:text-md text-ellipsis line-clamp-3">{item?.title}</h5>
                                                <h5 className="font-bold text-sm md:text-md mt-1"><small>₹ </small><strong>{item?.price}</strong></h5>
                                                <p className="mt-[.3rem] flex">
                                                    {Array.from({ length: item?.rating }).map((_) => {
                                                        return <p>⭐</p>
                                                    })}
                                                </p>
                                                <span className="mt-1 inline-block">
                                                    <span className="text-sm">Qty:</span> <input type="number" min="1" className="border-2 p-[.2rem]" value={item?.quantity} style={{ width: '5rem', marginLeft: '.5rem' }} />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>}
                        </div>
                        {(state?.basket?.length > 0 && submitted && clientSecret !== true) && <div ref={paymentRef} style={{ flex: .4 }}>
                            <h3 className="text-sm font-bold mt-[.3rem]">Payment Method</h3>
                            <div className="rounded  border-2 p-[1rem]">
                                <form onSubmit={handleSubmit}>
                                    <CardElement onChange={handleChange} />
                                    <div>
                                        <CurrencyFormat
                                            renderText={(value) => (
                                                <>
                                                    <p className="text-[1rem] mt-2">Subtotal ({getTotalItem(state.basket)} items): <strong>₹{getTotalAmount(state.basket)}</strong></p>
                                                </>
                                            )}
                                            decimalScale={2}
                                            value={0}
                                            displayType='text'
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                        />
                                        <button className='rounded mt-2 w-[100%] bg-color2 py-1 font-bold' disabled={processing || disabled || succeeded} >
                                            <span>{processing ? <p>Processing</p> : 'Buy Now'}</span>
                                        </button>
                                        {error && <div>{error}</div>}
                                    </div>
                                </form>
                            </div>
                        </div>}
                    </div>
                </div>
                {processing && <div className="fixed flex items-center justify-center bg-white" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }}>
                    <img src="/assets/processing.gif" alt="logo" className="h-[15rem] w-[15rem] md:h-[25rem] md:w-[25rem]" />
                </div>}
                <p className="relative text-center text-xs md:text-sm" style={{ bottom: '1.5rem', left: 0, right: 0 }}>© 2024 [<span className="font-bold text-md">Developed by: Muthuraj Marvar</span>]. All rights reserved. This project is a personal portfolio piece. Please contact me before reusing any part of it.</p>
            </div> : <div className="text-center mt-2 font-bold text-lg">Cart is empty.</div> : <div className="text-center mt-2"><button onClick={handleLogin} className='p-2 py-[.3rem] font-bold rounded text-black bg-color2 text-lg'>Login</button></div>}
        </>
    )
}

export default Payment