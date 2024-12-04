import React, { useContext, useEffect, useRef, useState } from 'react'
import Product from './Product'
import { StateContext } from '../StateProvider';
import { motion } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import { FaFilter } from "react-icons/fa";
import Filter from './Filter';

function Home() {
    const { state, dispatch } = useContext(StateContext);
    const [animate, setAnimate] = useState(false);
    const productsRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(16);
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [initial, setInitial] = useState(false);
    const [filter, setFilter] = useState(false);
    const [categories, setCategories] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                let response = await fetch('https://dummyjson.com/products/categories');
                const result = await response.json();
                setCategories(result);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let response = '';
                if ((state.search.trim().toLocaleLowerCase() === 'all products' || state.search === '') && !selectedCategories.length) {
                    response = await fetch(`https://dummyjson.com/products${selectedCategories.length > 0 ? `/category/${selectedCategories}` : ''}?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`);
                } else {
                    if (selectedCategories.length) {
                        response = await fetch(`https://dummyjson.com/products/${selectedCategories.length > 0 ? `category/${selectedCategories}` : ''}?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`);
                    } else if (state.search.length) {
                        response = await fetch(`https://dummyjson.com/products/${state.search ? `search?q=${state.search}` : ''}&limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`);
                    }
                }
                const result = await response.json();
                setTotalProducts(result.total);
                let data = result.products.map((item) => {
                    return {
                        id: item.id,
                        title: item.title,
                        price: +(item.price * 83.67).toFixed(2),
                        image: item.images[0],
                        rating: Math.floor(item.rating)
                    }
                })
                setProducts(data);
                setNewProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        let timeoutId;

        clearTimeout(timeoutId);
        setNewProducts([]);
        setLoading(true);

        timeoutId = setTimeout(() => {
            fetchProducts();
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [currentPage, itemsPerPage, state.search, selectedCategories]);

    useEffect(() => {
        setCurrentPage(1);
        setSelectedCategories([]);
    }, [state.search]);

    useEffect(() => {
        if (!loading && productsRef.current) {
            productsRef.current.focus();
            productsRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, [newProducts])

    useEffect(() => {
        setInitial(true);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
    }, [newProducts.length])

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <>
            <div className="home bg-color3">
                <div className="home__container">
                    <img className="home__image object-cover" src="https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg" alt="" />
                </div>
                {newProducts.length > 0 ? (
                    <div className="relative">
                        {!state.search && <span className='cursor-pointer absolute top-[5.5rem] md:top-[-9rem]' style={{ left: '.5rem', zIndex: 10 }} >
                            <FaFilter className='text-xl md:text-2xl cursor-pointer' onClick={() => setFilter((prev) => !prev)} />
                        </span>}
                        <div ref={productsRef} class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-[1rem] px-1 pt-[8rem] sm:pt-0 py-2 md:-translate-y-[14rem]">
                            {
                                newProducts.map(item => (
                                    <motion.div
                                        animate={animate ? { y: [-60, 0] } : {}} transition={{ duration: 0.5 }}><Product id={item.id} title={item.title} price={item.price} image={item.image} rating={item.rating} /></motion.div>
                                ))
                            }
                        </div>
                        <div className='-translate-y-[1.1rem] md:-translate-y-[14rem]'>
                            <div className="flex justify-end items-center p-1 py-[.2rem]">
                                <button onClick={handleFirstPage} disabled={currentPage === 1} whileTap={{ scale: 0.9 }} transition={{ duration: .3 }} className='mr-1 px-[.3rem] md:px-[1rem] py-[.2rem] md:py-[.1rem] bg-color2 text-black rounded-sm'>
                                    First
                                </button>
                                <button onClick={handlePrevPage} disabled={currentPage === 1} whileTap={{ scale: 0.9 }} transition={{ duration: .3 }} className='px-[.3rem] md:px-[1rem] py-[.2rem] md:py-[.1rem] bg-color2 text-black rounded-sm'>
                                    Previous
                                </button>
                                <span className="ml-1 mr-1 text-sm font-bold">Page {currentPage}</span>
                                <button onClick={handleNextPage} whileTap={{ scale: 0.9 }} transition={{ duration: .3 }} className='px-[.3rem] md:px-[1rem] py-[.1rem] md:py-[.2rem] bg-color2 text-black rounded-sm'>
                                    Next
                                </button>
                                <button onClick={handleLastPage} disabled={currentPage === totalPages} whileTap={{ scale: 0.9 }} transition={{ duration: .3 }} className='ml-1 px-[.3rem] md:px-[1rem] py-[.1rem] md:py-[.2rem] bg-color2 text-black rounded-sm'>
                                    Last
                                </button>
                            </div>
                            <p className="text-center text-xs md:text-sm mt-[.5rem] md:mt-[1.2rem]">© 2024 [<span className="font-bold text-md">Developed by: Muthuraj Marvar</span>]. All rights reserved. This project is a personal portfolio piece. Please contact me before reusing any part of it.</p>
                        </div>
                    </div>
                )
                    : (
                        loading ? <div className="text-center"><CircularProgress className="text-center font-bold text-xl font-custom" /></div> : <motion.div animate={animate ? { y: [-50, 0] } : {}} transition={{ duration: 0.5 }} className="text-center font-bold text-lg font-custom">No products found.<span className="p-[.2rem] bg-color2 ml-[.5rem] rounded cursor-pointer relative text-lg" style={{ zIndex: 30 }} onClick={() => {
                            setSelectedCategories([]);
                            dispatch({
                                type: 'UPDATE_SEARCH',
                                search: ''
                            });
                        }}>View all Products</span></motion.div>
                    )
                }
            </div>
            {filter && (
                <Filter filter={filter} setFilter={setFilter} categories={categories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            )
            }
        </>
    )
}

export default Home;