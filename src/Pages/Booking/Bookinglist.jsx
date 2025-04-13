import React, { useEffect, useState, useMemo } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, TextField,
    Stack, Skeleton, Select, MenuItem, FormControl,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button
} from '@mui/material';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import { GetAllBookingApi, UpdateStatusOfflineBookingApi } from '../../Api/Services/Payment';
import CreateBooking from './CreateOfflineBooking';
import { GetMYProfileApi } from '../../Api/Services/Admin';

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [modalopen, setModalopen] = useState(false)
    const [myhotel, setMyhotel] = useState([])

    const statusOptions = ["pending", "cancelled", "failed", "Booked", "checkout"]

    const columns = [
        { id: 'serial', label: 'S.No', minWidth: 50, isSerial: true },
        { id: 'BookingId', label: 'Booking ID', minWidth: 150 },
        { id: 'UserInformation.Name', label: 'User Name', minWidth: 150 },
        { id: 'UserInformation.Phonenumber', label: 'Phone Number', minWidth: 150 },
        { id: 'Numberofchildren', label: 'Children', minWidth: 150 },
        { id: 'bookingtype', label: 'Booking Type', minWidth: 150 },
        { id: 'createdAt', label: 'Booking Time', minWidth: 150 },
        { id: 'RoomId.RoomName', label: 'Room Name', minWidth: 150 },
        { id: 'RoomId.RoomNo', label: 'Room No', minWidth: 100 },
        { id: 'CheckinDate', label: 'Check-in', minWidth: 100 },
        { id: 'CheckOutDate', label: 'Check-out', minWidth: 100 },
        { id: 'TotalAmount', label: 'Total Amount (₹)', minWidth: 100 },
        { id: 'Status', label: 'Status', minWidth: 120 },
        { id: 'actions', label: 'Actions', minWidth: 120 }
    ];

    useEffect(() => {
        fetchBookings();
        fetchMYHotels()
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await GetAllBookingApi();
            if (res.status) {
                setBookings(res.data);
            } else {
                setBookings([]);
            }

        } finally {
            setLoading(false);
        }
    };


    const fetchMYHotels = async () => {
        try {
            const res = await GetMYProfileApi();
            if (res.status) {
                console.log(res.data)
                setMyhotel(res.data.Branch);
            } else {
                setMyhotel([]);
            }

        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus, bookingId) => {
        setLoading(true)
        try {
            let res = await UpdateStatusOfflineBookingApi(newStatus, bookingId)
            if (res.status) {
                toast.success("Status updated successfully");
                fetchBookings()
            } else {
                toast.success(res.message);
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(false)
        }
    };

    const handleOpenPayment = (payment) => {
        setSelectedPayment(payment);
    };

    const handleClosePayment = () => {
        setSelectedPayment(null);
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking =>
            booking.BookingId?.toLowerCase().includes(search.toLowerCase()) ||
            booking.UserInformation?.Name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.RoomId?.RoomNo?.toLowerCase().includes(search.toLowerCase())
        );
    }, [bookings, search]);

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Loader loading={loading} />

            <CreateBooking
                open={modalopen}
                onClose={() => setModalopen(false)}
                hotel={myhotel}
                trigger={()=>fetchBookings()}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ maxWidth: 300 }}
                />
                <Button variant="contained" color="primary" onClick={()=>setModalopen(true)}>
                    Create Offline Booking
                </Button>
            </Stack>

            <TableContainer sx={{ maxHeight: 740 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <TableRow key={idx}>
                                    {columns.map((_, colIdx) => (
                                        <TableCell key={colIdx}><Skeleton variant="text" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : filteredBookings.length > 0 ? (
                            filteredBookings
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((booking, index) => (
                                    <TableRow hover key={booking._id}>
                                        {columns.map((column) => {
                                            if (column.id === 'serial') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {page * rowsPerPage + index + 1}
                                                    </TableCell>
                                                );
                                            }

                                            const value = column.id.split('.').reduce((acc, part) => acc && acc[part], booking);

                                            if (column.id === 'Status') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        <FormControl fullWidth size="small">
                                                            <Select
                                                                value={booking.Status}
                                                                onChange={(e) => handleStatusChange(e.target.value, booking._id)}
                                                            >
                                                                {statusOptions.map((option) => (
                                                                    <MenuItem key={option} value={option}>
                                                                        {option}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </TableCell>
                                                );
                                            }

                                            if (column.id === 'actions') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleOpenPayment(booking.PaymentId)}
                                                        >
                                                            View Payment
                                                        </Button>
                                                    </TableCell>
                                                );
                                            }

                                            return (
                                                <TableCell key={column.id}>
                                                    {value || '-'}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && filteredBookings.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredBookings.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}

            {/* Payment Info Dialog */}
            <Dialog open={!!selectedPayment} onClose={handleClosePayment}>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogContent>
                    {selectedPayment ? (
                        <DialogContentText component="div">
                            <p><strong>Payment ID:</strong> {selectedPayment._id}</p>
                            <p><strong>Transaction ID:</strong> {selectedPayment.merchantTransactionId}</p>
                            <p><strong>Total Amount:</strong> ₹{selectedPayment.TotalAmount}</p>
                            <p><strong>Tax:</strong> ₹{selectedPayment.Tax}</p>
                            <p><strong>Status:</strong> {selectedPayment.Status ? 'Success' : 'Failed'}</p>
                        </DialogContentText>
                    ) : (
                        <p>No payment data available</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePayment}>Close</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
