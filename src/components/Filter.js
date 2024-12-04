import { Box, Modal } from '@mui/material'
import React, { useEffect } from 'react';
import { FaRegTimesCircle } from "react-icons/fa";

const style = {
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    py: 2,
    px: 1,
    fontFamily: "Oxygen",
    borderRadius: '.5rem'
};

function Filter({ filter, setFilter, categories, selectedCategories, setSelectedCategories }) {
    function handleCategory(e) {
        if (e.target.checked && e.target.value !== 'none') {
            setSelectedCategories([e.target.value]);
        } else {
            setSelectedCategories([]);
        }
    }

    useEffect(() => {
        return () => {
            // setFilter(false);
        }
    }, [])

    return (
        <Modal
            open={filter}
            onClose={() => setFilter((prev) => !prev)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ fontFamily: "Oxygen" }}
        >
            <Box sx={style} className="p-3 w-[95%] md:w-[65%] relative">
                <FaRegTimesCircle className="absolute text-2xl cursor-pointer" style={{ top: '1rem', right: '1rem' }} onClick={() => setFilter(false)} />
                <h1 className="text-left font-bold text-xl block ml-1">Filter</h1>
                <h1 className="text-left font-bold text-lg block ml-1 mt-[1rem] mb-1">Categories</h1>
                <div class="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 md:gap-[1.5rem] py-1 px-1" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <div class="bg-color3 p-[.5rem] rounded flex items-center border-2">
                        <input onClick={handleCategory} type="radio" id='none' name="category" value='none' checked={selectedCategories.length === 0} className='h-[1rem] w-[1rem]' />
                        <label className='ml-1 text-sm md:text-md font-normal cursor-pointer' for='none'>None</label><br></br>
                    </div>
                    {
                        categories.map((category) =>
                            <div class="bg-color3 p-[.5rem] rounded flex items-center border-2">
                                <input onClick={handleCategory} type="radio" id={category.name} name="category" value={category.slug} checked={selectedCategories?.includes(category.slug)} className='h-[1rem] w-[1rem]' />
                                <label className='ml-1 text-sm md:text-md font-normal cursor-pointer' for={category.name}>{category.name}</label><br></br>
                            </div>)
                    }
                </div>
            </Box>
        </Modal>
    )
}

export default Filter