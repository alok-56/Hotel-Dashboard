import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, TextField,
    Stack, Skeleton, Select, MenuItem, FormControl,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, Tabs, Tab, Box, Typography,
    Chip, Grid,
    Alert,
    IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import { DeleteExtra, GetAllBookingApi, GetExtra, UpdateStatusOfflineBookingApi } from '../../Api/Services/Payment';
import CreateBooking from './CreateOfflineBooking';
import { GetMYProfileApi } from '../../Api/Services/Admin';
import ExtraChargeModal from './ExtraChargeModal';
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`booking-tabpanel-${index}`}
            aria-labelledby={`booking-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Move BookingTable outside as a separate component to prevent recreation
const BookingTable = React.memo(({
    title,
    search,
    startDate,
    endDate,
    filteredBookings,
    loading,
    page,
    rowsPerPage,
    columns,
    statusOptions,
    onSearchChange,
    onStartDateChange,
    onEndDateChange,
    onClearFilters,
    onCreateBookingClick,
    onStatusChangeRequest,
    onOpenPayment,
    onAddExtra,
    onChangePage,
    onChangeRowsPerPage,
    getStatusColor
}) => {
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{title}</Typography>
                <Button variant="contained" color="primary" onClick={onCreateBookingClick}>
                    Create Offline Booking
                </Button>
            </Stack>

            {/* Filters */}
            <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={onSearchChange}
                    sx={{ minWidth: 200 }}
                />
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={onStartDateChange}
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{ maxHeight: 40 }}
                />

                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={onEndDateChange}
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{ maxHeight: 40 }}
                />

                <Button
                    variant="outlined"
                    size="small"
                    onClick={onClearFilters}
                    sx={{ height: 36 }}
                >
                    Clear Filters
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

                                            if (column.id === 'PendingAmount') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        ₹{booking.PendingAmount || 0}
                                                    </TableCell>
                                                );
                                            }

                                            if (column.id === 'Status') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        <FormControl fullWidth size="small">
                                                            <Select
                                                                value={booking.Status}
                                                                onChange={(e) => onStatusChangeRequest(e.target.value, booking._id, booking.BookingId)}
                                                            >
                                                                {statusOptions.map((option) => (
                                                                    <MenuItem key={option} value={option}>
                                                                        <Chip
                                                                            label={option}
                                                                            color={getStatusColor(option)}
                                                                            size="small"
                                                                        />
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
                                                        <Stack direction="row" spacing={1}>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => onOpenPayment(booking.PaymentId)}
                                                            >
                                                                Payment
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                color="secondary"
                                                                onClick={() => onAddExtra(booking)}
                                                                disabled={booking.Status === 'checkout' || booking.Status === 'cancelled'}
                                                            >
                                                                Add Extra
                                                            </Button>
                                                        </Stack>
                                                    </TableCell>
                                                );
                                            }

                                            if (column.id === 'createdAt' || column.id === 'CheckinDate' || column.id === 'CheckOutDate') {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {value ? new Date(value).toLocaleDateString() : '-'}
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
                    onPageChange={onChangePage}
                    onRowsPerPageChange={onChangeRowsPerPage}
                />
            )}
        </Box>
    );
});

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingExtra, setLoadingExtra] = useState(false); // Separate loader for extra charges
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [modalopen, setModalopen] = useState(false);
    const [myhotel, setMyhotel] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [extraCharges, setExtraCharges] = useState([]);
    const [bookingid, seyBookingid] = useState('')

    // Status update confirmation - Fixed the state structure
    const [statusConfirmDialog, setStatusConfirmDialog] = useState({
        open: false,
        newStatus: '',
        bookingId: '',
        bookingDbId: '', // Added separate field for database ID
        bookingData: null
    });

    // Food details modal
    const [foodDetailsModal, setFoodDetailsModal] = useState({
        open: false,
        booking: null
    });

    // Extra Charge modal - Fixed the state name
    const [extraChargeModal, setExtraChargeModal] = useState({
        open: false,
        booking: null
    });

    const statusOptions = ["pending", "cancelled", "failed", "Booked", "checkin", "checkout"];

    const columns = [
        { id: 'serial', label: 'S.No', minWidth: 50, isSerial: true },
        { id: 'BookingId', label: 'Booking ID', minWidth: 150 },
        { id: 'UserInformation.Name', label: 'User Name', minWidth: 150 },
        { id: 'UserInformation.Phonenumber', label: 'Phone Number', minWidth: 150 },
        { id: 'Numberofchildren', label: 'Children', minWidth: 100 },
        { id: 'bookingtype', label: 'Booking Type', minWidth: 150 },
        { id: 'createdAt', label: 'Booking Time', minWidth: 150 },
        { id: 'RoomId.RoomName', label: 'Room Name', minWidth: 150 },
        { id: 'RoomId.RoomNo', label: 'Room No', minWidth: 100 },
        { id: 'CheckinDate', label: 'Check-in', minWidth: 100 },
        { id: 'CheckOutDate', label: 'Check-out', minWidth: 100 },
        { id: 'TotalAmount', label: 'Total Amount (₹)', minWidth: 140 },
        { id: 'PendingAmount', label: 'Pending Amount (₹)', minWidth: 160 },
        { id: 'Status', label: 'Status', minWidth: 120 },
        { id: 'actions', label: 'Actions', minWidth: 200 }
    ];

    useEffect(() => {
        fetchBookings();
        fetchMYHotels();
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
                console.log(res.data);
                setMyhotel(res.data.Branch);
            } else {
                setMyhotel([]);
            }
        } catch (error) {
            console.error("Error fetching hotels:", error);
            setMyhotel([]);
        }
    };

    // Memoize event handlers to prevent recreating functions on every render
    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    const handleStartDateChange = useCallback((date) => {
        setStartDate(date);
    }, []);

    const handleEndDateChange = useCallback((date) => {
        setEndDate(date);
    }, []);

    const handleClearFilters = useCallback(() => {
        setStartDate(null);
        setEndDate(null);
        setSearch('');
    }, []);

    // Fixed the status change request handler
    const handleStatusChangeRequest = useCallback((newStatus, bookingDbId, bookingId) => {
        const booking = bookings.find(b => b._id === bookingDbId);
        fetchExtraCharges(bookingId);
        setStatusConfirmDialog({
            open: true,
            newStatus,
            bookingId: bookingId, // This is the BookingId (string)
            bookingDbId: bookingDbId, // This is the _id (database ID)
            bookingData: booking
        });
    }, [bookings]);

    const handleStatusChangeConfirm = async () => {
        const { newStatus, bookingDbId } = statusConfirmDialog;
        seyBookingid(bookingDbId)


        if (newStatus === 'checkout') {
            const booking = bookings.find(b => b._id === bookingDbId);
            setFoodDetailsModal({
                open: true,
                booking: booking
            });
            setStatusConfirmDialog({
                open: false,
                newStatus: '',
                bookingId: '',
                bookingDbId: '',
                bookingData: null
            });
            return;
        }

        setLoading(true);
        try {
            let res = await UpdateStatusOfflineBookingApi(newStatus, bookingDbId, totalExtraAmount);
            if (res.status) {
                toast.success("Status updated successfully");
                fetchBookings();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
            setStatusConfirmDialog({
                open: false,
                newStatus: '',
                bookingId: '',
                bookingDbId: '',
                bookingData: null
            });
        }
    };

    const handleCheckoutConfirm = async () => {

        setLoading(true);
        try {
            let res = await UpdateStatusOfflineBookingApi('checkout', bookingid, totalExtraAmount);
            if (res.status) {
                toast.success("Checkout completed successfully");
                fetchBookings();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to complete checkout");
        } finally {
            setLoading(false);
            setFoodDetailsModal({ open: false, booking: null });
        }
    };

    const handleOpenPayment = useCallback((payment) => {
        setSelectedPayment(payment);
    }, []);

    const handleClosePayment = useCallback(() => {
        setSelectedPayment(null);
    }, []);

    // Fixed the function name and implementation
    const handleAddExtra = useCallback((booking) => {
        setExtraChargeModal({
            open: true,
            booking: booking
        });
    }, []);

    const handleCreateBookingClick = useCallback(() => {
        setModalopen(true);
    }, []);

    const handleChangePage = useCallback((e, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    }, []);

    const handleTabChange = useCallback((event, newValue) => {
        setTabValue(newValue);
        setPage(0); // Reset page when switching tabs
    }, []);

    const getStatusColor = useCallback((status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'Booked': return 'info';
            case 'checkout': return 'success';
            case 'cancelled': return 'error';
            case 'failed': return 'error';
            default: return 'default';
        }
    }, []);

    // Filter bookings based on tab and date range
    const filteredBookings = useMemo(() => {
        let filtered = bookings;

        // Filter by tab (booking status)
        if (tabValue === 1) { // New Bookings
            filtered = filtered.filter(booking => booking.Status === 'pending' || booking.Status === 'Booked');
        } else if (tabValue === 2) { // Completed Bookings
            filtered = filtered.filter(booking => booking.Status === 'checkout');
        }
        // tabValue === 0 shows all bookings

        // Filter by search
        filtered = filtered.filter(booking =>
            booking.BookingId?.toLowerCase().includes(search.toLowerCase()) ||
            booking.UserInformation?.Name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.RoomId?.RoomNo?.toLowerCase().includes(search.toLowerCase())
        );

        // Filter by date range
        if (startDate || endDate) {
            filtered = filtered.filter(booking => {
                const bookingDate = new Date(booking.createdAt);
                if (startDate && bookingDate < startDate) return false;
                if (endDate && bookingDate > endDate) return false;
                return true;
            });
        }

        return filtered;
    }, [bookings, search, tabValue, startDate, endDate]);

    // Fixed fetchExtraCharges with proper loader
    const fetchExtraCharges = async (bookingId) => {
        setLoadingExtra(true);
        try {
            const response = await GetExtra(bookingId);
            if (response.status) {
                setExtraCharges(response.data || []);
            } else {
                setExtraCharges([]);
            }
        } catch (error) {
            toast.error("Failed to fetch extra charges");
            setExtraCharges([]);
        } finally {
            setLoadingExtra(false);
        }
    };

    const totalExtraAmount = extraCharges.reduce(
        (sum, charge) => sum + (charge.Amount || 0),
        0
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Loader loading={loading || loadingExtra} />

                <CreateBooking
                    open={modalopen}
                    onClose={() => setModalopen(false)}
                    hotel={myhotel}
                    trigger={() => fetchBookings()}
                />

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="All Bookings" />
                        <Tab label="New Bookings" />
                        <Tab label="Completed Bookings" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <BookingTable
                        title="All Bookings"
                        search={search}
                        startDate={startDate}
                        endDate={endDate}
                        filteredBookings={filteredBookings}
                        loading={loading}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        columns={columns}
                        statusOptions={statusOptions}
                        onSearchChange={handleSearchChange}
                        onStartDateChange={handleStartDateChange}
                        onEndDateChange={handleEndDateChange}
                        onClearFilters={handleClearFilters}
                        onCreateBookingClick={handleCreateBookingClick}
                        onStatusChangeRequest={handleStatusChangeRequest}
                        onOpenPayment={handleOpenPayment}
                        onAddExtra={handleAddExtra}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        getStatusColor={getStatusColor}
                    />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <BookingTable
                        title="New Bookings"
                        search={search}
                        startDate={startDate}
                        endDate={endDate}
                        filteredBookings={filteredBookings}
                        loading={loading}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        columns={columns}
                        statusOptions={statusOptions}
                        onSearchChange={handleSearchChange}
                        onStartDateChange={handleStartDateChange}
                        onEndDateChange={handleEndDateChange}
                        onClearFilters={handleClearFilters}
                        onCreateBookingClick={handleCreateBookingClick}
                        onStatusChangeRequest={handleStatusChangeRequest}
                        onOpenPayment={handleOpenPayment}
                        onAddExtra={handleAddExtra}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        getStatusColor={getStatusColor}
                    />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <BookingTable
                        title="Completed Bookings"
                        search={search}
                        startDate={startDate}
                        endDate={endDate}
                        filteredBookings={filteredBookings}
                        loading={loading}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        columns={columns}
                        statusOptions={statusOptions}
                        onSearchChange={handleSearchChange}
                        onStartDateChange={handleStartDateChange}
                        onEndDateChange={handleEndDateChange}
                        onClearFilters={handleClearFilters}
                        onCreateBookingClick={handleCreateBookingClick}
                        onStatusChangeRequest={handleStatusChangeRequest}
                        onOpenPayment={handleOpenPayment}
                        onAddExtra={handleAddExtra}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        getStatusColor={getStatusColor}
                    />
                </TabPanel>

                {/* Status Update Confirmation Dialog */}
                <Dialog open={statusConfirmDialog.open} onClose={() => setStatusConfirmDialog({
                    open: false,
                    newStatus: '',
                    bookingId: '',
                    bookingDbId: '',
                    bookingData: null
                })}>
                    <DialogTitle>Confirm Status Update</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to change the status to "{statusConfirmDialog.newStatus}"
                            for booking ID: {statusConfirmDialog.bookingData?.BookingId}?
                        </DialogContentText>
                        {statusConfirmDialog.bookingData && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Guest:</strong> {statusConfirmDialog.bookingData.UserInformation?.Name}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Room:</strong> {statusConfirmDialog.bookingData.RoomId?.RoomName} - {statusConfirmDialog.bookingData.RoomId?.RoomNo}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setStatusConfirmDialog({
                            open: false,
                            newStatus: '',
                            bookingId: '',
                            bookingDbId: '',
                            bookingData: null
                        })}>
                            Cancel
                        </Button>
                        <Button onClick={handleStatusChangeConfirm} variant="contained">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Food Details Modal for Checkout */}
                <Dialog open={foodDetailsModal.open} onClose={() => setFoodDetailsModal({ open: false, booking: null })} maxWidth="md" fullWidth>
                    <DialogTitle>Checkout - Food & Billing Details</DialogTitle>
                    <DialogContent>
                        {foodDetailsModal.booking && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Booking Details
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Typography><strong>Booking ID:</strong> {foodDetailsModal.booking.BookingId}</Typography>
                                        <Typography><strong>Guest:</strong> {foodDetailsModal.booking.UserInformation?.Name}</Typography>
                                        <Typography><strong>Room:</strong> {foodDetailsModal.booking.RoomId?.RoomName} - {foodDetailsModal.booking.RoomId?.RoomNo}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography><strong>Check-in:</strong> {new Date(foodDetailsModal.booking.CheckinDate).toLocaleDateString()}</Typography>
                                        <Typography><strong>Check-out:</strong> {new Date(foodDetailsModal.booking.CheckOutDate).toLocaleDateString()}</Typography>
                                        <Typography><strong>Total Amount:</strong> ₹{foodDetailsModal.booking.TotalAmount}</Typography>
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" gutterBottom>
                                    Extra Charges
                                </Typography>

                                {loadingExtra ? (
                                    <Box display="flex" justifyContent="center" p={2}>
                                        <Typography>Loading extra charges...</Typography>
                                    </Box>
                                ) : extraCharges.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Name/Description</TableCell>
                                                    <TableCell align="right">Amount (₹)</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {extraCharges.map((charge, index) => (
                                                    <TableRow key={charge._id || index}>
                                                        <TableCell>{charge.Extratype}</TableCell>
                                                        <TableCell>{charge.Name}</TableCell>
                                                        <TableCell align="right">₹{charge.Amount}</TableCell>
                                                        <TableCell align="center">
                                                            {/* Add action buttons here if needed */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Alert severity="info">No extra charges added yet.</Alert>
                                )}

                                {/* Total Amount */}
                                {extraCharges.length > 0 && (
                                    <Box sx={{ mt: 3, p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
                                        <Typography variant="h6" color="primary.contrastText">
                                            Total Extra Charges: ₹{totalExtraAmount}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setFoodDetailsModal({ open: false, booking: null })}>
                            Cancel
                        </Button>
                        <Button onClick={handleCheckoutConfirm} variant="contained" color="success">
                            Complete Checkout
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Extra Charge Modal */}
                <ExtraChargeModal
                    open={extraChargeModal.open}
                    onClose={() => setExtraChargeModal({ open: false, booking: null })}
                    booking={extraChargeModal.booking}
                    onSuccess={() => {
                        fetchBookings();
                        setExtraChargeModal({ open: false, booking: null });
                        toast.success("Extra charges added successfully");
                    }}
                />

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
        </LocalizationProvider>
    );
}