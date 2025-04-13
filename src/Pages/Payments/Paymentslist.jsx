import React, { useEffect, useState, useMemo } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, TextField,
    Stack, Skeleton, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import { GetAllPaymentApi } from '../../Api/Services/Payment';


export default function PaymentList() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const columns = [
        { id: 'serial', label: 'S.No', minWidth: 50 },
        { id: 'merchantTransactionId', label: 'Transaction ID', minWidth: 180 },
        { id: 'BookingId.BookingId', label: 'Booking ID', minWidth: 150 },
        { id: 'BookingId.bookingtype', label: 'Booking Type', minWidth: 100 },
        { id: 'BookingId.CheckinDate', label: 'Check-in', minWidth: 120 },
        { id: 'BookingId.CheckOutDate', label: 'Check-out', minWidth: 120 },
        { id: 'BookingId.UserInformation.Name', label: 'User Name', minWidth: 150 },
        { id: 'BookingId.UserInformation.Phonenumber', label: 'Phone Number', minWidth: 150 },
        { id: 'TotalAmount', label: 'Total Amount (₹)', minWidth: 120 },
        { id: 'Tax', label: 'Tax (₹)', minWidth: 100 },
        { id: 'Status', label: 'Payment Status', minWidth: 130 },
        { id: 'actions', label: 'Actions', minWidth: 120 }
    ];

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await GetAllPaymentApi();
            if (res.status) {
                setPayments(res.data);
            } else {
                toast.error("Failed to load payments");
            }
        } catch (error) {
            toast.error("Error fetching payments");
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            const userName = payment?.BookingId?.UserInformation?.Name || '';
            const bookingId = payment?.BookingId?.BookingId || '';
            const phone = payment?.BookingId?.UserInformation?.Phonenumber || '';
            return (
                userName.toLowerCase().includes(search.toLowerCase()) ||
                bookingId.toLowerCase().includes(search.toLowerCase()) ||
                phone.toString().includes(search)
            );
        });
    }, [payments, search]);

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    const handleViewBooking = (booking) => setSelectedBooking(booking);
    const handleCloseDialog = () => setSelectedBooking(null);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Loader loading={loading} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ maxWidth: 300 }}
                />
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
                        ) : filteredPayments.length > 0 ? (
                            filteredPayments
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((payment, index) => (
                                    <TableRow hover key={payment._id}>
                                        {columns.map((col) => {
                                            if (col.id === 'serial') {
                                                return (
                                                    <TableCell key={col.id}>
                                                        {page * rowsPerPage + index + 1}
                                                    </TableCell>
                                                );
                                            }

                                            if (col.id === 'actions') {
                                                return (
                                                    <TableCell key={col.id}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleViewBooking(payment.BookingId)}
                                                        >
                                                            View Booking
                                                        </Button>
                                                    </TableCell>
                                                );
                                            }

                                            const value = col.id.split('.').reduce((acc, part) => acc && acc[part], payment);
                                            if (col.id === 'Status') {
                                                return (
                                                    <TableCell key={col.id}>
                                                        {value ? 'Success' : 'Failed'}
                                                    </TableCell>
                                                );
                                            }

                                            return (
                                                <TableCell key={col.id}>
                                                    {value || '-'}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No payment data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && filteredPayments.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredPayments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}

            {/* Booking Details Dialog */}
            <Dialog open={!!selectedBooking} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogContent dividers>
                    {selectedBooking ? (
                        <>
                            <Typography><strong>Booking ID:</strong> {selectedBooking.BookingId}</Typography>
                            <Typography><strong>Type:</strong> {selectedBooking.bookingtype}</Typography>
                            <Typography><strong>Status:</strong> {selectedBooking.Status}</Typography>
                            <Typography><strong>Check-in:</strong> {new Date(selectedBooking.CheckinDate).toLocaleDateString()}</Typography>
                            <Typography><strong>Check-out:</strong> {new Date(selectedBooking.CheckOutDate).toLocaleDateString()}</Typography>
                            <Typography><strong>Children:</strong> {selectedBooking.Numberofchildren}</Typography>
                            <Typography><strong>Total Amount:</strong> ₹{selectedBooking.TotalAmount}</Typography>
                            <Typography><strong>User:</strong> {selectedBooking.UserInformation?.Name}</Typography>
                            <Typography><strong>Phone:</strong> {selectedBooking.UserInformation?.Phonenumber}</Typography>
                        </>
                    ) : (
                        <Typography>No booking data available.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
