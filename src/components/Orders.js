import React, { useContext, useEffect, useState } from 'react'
import { StateContext } from '../StateProvider';
import axios from '../axios';
import dayjs from "dayjs";
import moment from "moment-timezone";
import CircularProgress from "@mui/material/CircularProgress";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { Grid, Modal } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { FaFileExcel, FaShoppingBasket, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '90%',
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    py: 3,
    px: 3,
    fontFamily: "Oxygen",
};

function createData(date_time, orderId, amount) {
    return { date_time, orderId, amount };
}

function Orders() {
    const history = useHistory();
    const [orders, setOrders] = useState([]);
    const { state } = useContext(StateContext);
    const { user } = state;
    const [loading, setLoading] = useState(false);
    const today = dayjs().startOf("day");
    const [value, setValue] = React.useState([today, today]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [newData, setNewData] = useState(null);
    const [totalRow, setTotalRow] = useState(0);
    const [showProducts, setShowProducts] = useState(false);
    const [products, setProducts] = useState([]);

    const columns = [
        {
            id: "date_time",
            label: `Date/Time`,
            minWidth: 100,
        },
        { id: "orderId", label: 'OrderId', minWidth: 200 },
        { id: "amount", label: `Amount_₹`, minWidth: 50 },
        {
            id: "Action",
            label: `Action`,
            minWidth: 20,
        },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
        setOrders(null);
        setNewData(null);
    };

    function onProducts(id) {
        setShowProducts(true);
        setProducts(orders[id])
    }

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [page, rowsPerPage]);

    useEffect(() => {
        if (orders) {
            const firstFiveElements = orders?.slice(0, rowsPerPage);
            const ldata = firstFiveElements?.map((item, i) => {
                console.log(item.orderId)
                const utcDate = new Date(item.createdAt);
                const formattedTime = moment
                    .utc(utcDate)
                    .tz("Asia/Kolkata")
                    .format("D/M/YYYY hh:mm A");

                return createData(
                    formattedTime,
                    item.orderId,
                    new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(item.amount / 100),
                );
            });
            setNewData(ldata);
        }
    }, [orders]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [value]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user?.uid])

    const fetchData = async () => {
        const response = await axios({
            method: 'post',
            url: `/orders/get?page=${page}&limit=${rowsPerPage}&sdate=${new Date(value[0])}&edate=${new Date(value[1])}&user=${user?.uid}`,
            data: { user: user?.uid }
        });
        setOrders(response?.data?.data);
        // console.log(response?.data?.data)

        setLoading(false);
        if (totalRow === 0) {
            setTotalRow(response?.data?.data?.length);
            setOrders(response?.data?.data);
        } else {
            setOrders(response?.data?.data);
        }
    };

    const handleOkClick = (newValue) => {
        fetchData();
    };

    function onReport() {

    }

    function handleLogin() {
        history.replace('/login', { type: 'orders' });
    }

    return (
        <>
            {state.user ? <div>
                <div className="bg-color3 p-1">
                    <h1 className="font-bold mt-[.1rem] text-xl">Your Orders</h1>
                    <div className="mt-[.2rem] h-[85vh] bg-white p-1 rounded">
                        {loading ? (
                            <div className="text-center"><CircularProgress className="loader" /></div>
                        ) : (
                            <>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid
                                        container
                                        spacing={2}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Grid item xs={10} sm={6} md={4}>
                                            <Box style={{ marginTop: "2rem" }}>
                                                <DateRangePicker
                                                    startText={`Start Date`}
                                                    endText={`End Date`}
                                                    value={value}
                                                    onChange={(newValue) => {
                                                        if (newValue[1]) {
                                                            console.log(
                                                                "End date selected:",
                                                                newValue[1].format("YYYY-MM-DD")
                                                            );
                                                        }
                                                        setTotalRow(0);
                                                        setValue(newValue);
                                                        setPage(0);
                                                        setOrders(null);
                                                        setNewData(null);
                                                    }}
                                                    onAccept={handleOkClick}
                                                    renderInput={(startProps, endProps) => (
                                                        <>
                                                            <TextField {...startProps} />
                                                            <Box sx={{ mx: 2 }}> to </Box>
                                                            <TextField {...endProps} />
                                                        </>
                                                    )}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <FaFileExcel className="export-icon text-2xl md:text-3xl text-color2 cursor-pointer" onClick={onReport} />
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>
                                <Paper
                                    sx={{ width: "100%", overflow: "hidden" }}
                                    style={{ marginTop: "1rem" }}
                                >
                                    <TableContainer sx={{ maxHeight: 400 }}>
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                            sx={{
                                                "& .MuiTableCell-root": {
                                                    fontSize: "1.4rem",
                                                    fontFamily: "Oxygen",
                                                },
                                            }}
                                        >
                                            <TableHead
                                                sx={{
                                                    "& .MuiTableCell-root": {
                                                        fontWeight: "bold",
                                                    },
                                                }}
                                            >
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {newData?.map((row, inx) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            key={row.code}
                                                        >
                                                            {columns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <>
                                                                        <TableCell key={column.id} align={column.align}>
                                                                            {column.format && typeof value === "number"
                                                                                ? column.format(value)
                                                                                : value}
                                                                            {column.id === "Action" && (
                                                                                <TableCell
                                                                                    key={column.id}
                                                                                    align={column.align}
                                                                                    style={{
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                    }}
                                                                                >
                                                                                    <FaShoppingBasket
                                                                                        onClick={() => onProducts(inx)}
                                                                                        style={{
                                                                                            color: "#cd9042",
                                                                                            cursor: "pointer",
                                                                                            fontSize: "1.1rem",
                                                                                        }}
                                                                                    />

                                                                                </TableCell>
                                                                            )}
                                                                        </TableCell>
                                                                    </>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={totalRow}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[5, 10, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        sx={{
                                            "& .MuiTablePagination-toolbar": { fontSize: "1.4rem" },
                                            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-actions,& .css-levciy-MuiTablePagination-displayedRows":
                                            {
                                                fontSize: "1.4rem",
                                                fontFamily: "Oxygen",
                                            },
                                            "& .css-i4bv87-MuiSvgIcon-root": {
                                                fontSize: "2.5rem",
                                                fontFamily: "Oxygen",
                                            },
                                        }}
                                    />
                                </Paper>
                            </>
                        )}
                    </div>
                    {showProducts && (
                        <Modal
                            open={showProducts}
                            onClose={() => setShowProducts((prev) => !prev)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            style={{ fontFamily: "Oxygen", borderRadius: '3px' }}
                        >
                            <Box sx={style} className="flex flex-col relative font-custom">
                                <FaTimes className='absolute text-xl' style={{ top: '.5rem', right: '.5rem' }} onClick={() => setShowProducts(false)} />
                                <h1 className='font-bold text-xl'>Order Details</h1>
                                <div className='mt-1'>
                                    <h1 className='font-normal text-sm md:text-md'>OrderId: {products.orderId}</h1>
                                    <h1 className='font-normal text-sm md:text-md'>Reciever Details: {products.receiverName}, {products.line1}, {products.city}, {products.pincode}, {products.country}</h1>
                                    <h1 className='font-normal text-sm md:text-md'>PaymentId: {products._id}</h1>
                                </div>
                                <h1 className='font-bold text-md mt-1'>Ordered Products:</h1>
                                <div style={{ maxHeight: '430px', overflowY: 'auto' }} className="mt-[.1rem] md:mt-1 mb-[.3rem] md:mb-1">
                                    {products.basket.map((item) => (
                                        <motion.div whileHover={{ scale: .99 }} transition={{ duration: .3 }} className="bg-white px-1 md:px-2 py-[0rem] md:py-[.2rem] font-bold rounded border-2 relative mt-[.6rem]" style={{ width: '100%' }}>
                                            <div className="flex flex-row items-center">
                                                <div className="flex justify-center mt-[.5rem] md:mt-[.1rem] w-[190px] h-[130px] md:h-[130px]" >
                                                    <img src={item?.image} alt="" className='object-contain w-[150px]' />
                                                </div>
                                                <div className="py-1 px-[.1rem] md:px-[1rem]" style={{ flex: 1 }}>
                                                    <h5 className="font-normal text-sm md:text-md text-ellipsis line-clamp-2">{item?.title}</h5>
                                                    <h5 className="font-bold text-sm md:text-md mt-1"><small>₹ </small><strong>{item?.price}</strong></h5>
                                                    <p className="mt-[.3rem] flex">
                                                        {Array.from({ length: item?.rating }).map((_) => {
                                                            return <p>⭐</p>
                                                        })}
                                                    </p>
                                                    <span className="mt-1 inline-block">
                                                        <span className="text-sm">Qty:</span> <input disabled type="number" min="1" className="border-2 p-[.2rem] w-[3rem] md:w-[5rem]" value={item?.quantity} style={{ marginLeft: '.5rem' }} />
                                                    </span>
                                                    <span className="ml-0 md:ml-1 block md:inline text-sm md:text:md mt-[.2rem]"> <span className="hidden md:inline">* {item?.price} = </span> {new Intl.NumberFormat('en-IN', {
                                                        style: 'currency',
                                                        currency: 'INR',
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }).format(item?.price * item?.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <h1 className='font-bold text-md mt-1 font-custom'>Total Amount: {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(products.amount / 100)}
                                </h1>
                            </Box>
                        </Modal>
                    )
                    }
                </div>
                <p className="fixed text-center text-xs md:text-sm" style={{ bottom: '1.2rem', left: 0, right: 0 }}>© 2024 [<span className="font-bold text-md">Developed by: Muthuraj Marvar</span>]. All rights reserved. This project is a personal portfolio piece. Please contact me before reusing any part of it.</p>
            </div> : <div className="text-center mt-2"><button onClick={handleLogin} className='p-2 py-[.3rem] font-bold rounded text-black bg-color2 text-lg'>Login</button></div>}
        </>
    )
}

export default Orders