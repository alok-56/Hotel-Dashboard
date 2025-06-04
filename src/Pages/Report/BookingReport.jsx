// import React, { useState, useMemo } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Grid,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Avatar,
//   IconButton,
//   InputAdornment,
//   Divider,
//   Stack,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from '@mui/material';
// import {
//   Search,
//   FilterList,
//   CalendarToday,
//   Person,
//   Phone,
//   Home,
//   CreditCard,
//   TrendingUp,
//   DateRange,
//   Group,
//   AttachMoney
// } from '@mui/icons-material';

// const BookingReport = () => {
//   // Sample data based on your JSON
//   const bookingData = [
//     {
//       UserInformation: {
//         Name: "alok",
//         Phonenumber: 8340175751,
//         Age: 23
//       },
//       _id: "683d5d8ef2f320a5b2d646cb",
//       BookingId: "181f8g8mbete4uq",
//       BranchId: "6829ad363876fd436306ef53",
//       RoomId: {
//         RoomName: "Room/R1/456",
//         RoomNo: "456",
//         Price: 3000,
//         numberofguest: 4,
//         features: ["bathroom", "mountain view", "balcony", "air conditioning", "TV"]
//       },
//       CheckinDate: "2025-06-02",
//       CheckOutDate: "2025-06-04",
//       bookingtype: "Offline",
//       Numberofchildren: 2,
//       Tax: 1200,
//       TotalAmount: 7200,
//       Status: "Booked",
//       PaymentId: {
//         ExtraChargeAmount: 32
//       },
//       PendingAmount: 0
//     },
//     {
//       UserInformation: {
//         Name: "test",
//         Phonenumber: 8340175751,
//         Age: 11
//       },
//       _id: "683f81ab17ee4224dc3bcf1e",
//       BookingId: "181fpsmmbh4xl6v",
//       BranchId: "6829ad363876fd436306ef53",
//       RoomId: {
//         RoomName: "Room/R1/456",
//         RoomNo: "456",
//         Price: 3000,
//         numberofguest: 4,
//         features: ["bathroom", "mountain view", "balcony", "air conditioning", "TV"]
//       },
//       CheckinDate: "2025-06-06",
//       CheckOutDate: "2025-06-07",
//       bookingtype: "Offline",
//       Numberofchildren: 2,
//       Tax: 23,
//       TotalAmount: 3023,
//       Status: "Booked",
//       PaymentId: {
//         ExtraChargeAmount: 0
//       },
//       PendingAmount: 0
//     }
//   ];

//   const [filters, setFilters] = useState({
//     startDate: '',
//     endDate: '',
//     username: '',
//     phoneNumber: '',
//     status: 'all'
//   });

//   // Calculate totals
//   const totals = useMemo(() => {
//     const filtered = bookingData.filter(booking => {
//       const matchesUsername = !filters.username || 
//         booking.UserInformation.Name.toLowerCase().includes(filters.username.toLowerCase());
//       const matchesPhone = !filters.phoneNumber || 
//         booking.UserInformation.Phonenumber.toString().includes(filters.phoneNumber);
//       const matchesStatus = filters.status === 'all' || booking.Status.toLowerCase() === filters.status.toLowerCase();
      
//       return matchesUsername && matchesPhone && matchesStatus;
//     });

//     return {
//       totalBookings: filtered.length,
//       totalRevenue: filtered.reduce((sum, booking) => sum + booking.TotalAmount, 0),
//       totalTax: filtered.reduce((sum, booking) => sum + booking.Tax, 0),
//       avgBookingValue: filtered.length > 0 ? 
//         (filtered.reduce((sum, booking) => sum + booking.TotalAmount, 0) / filtered.length).toFixed(2) : 0
//     };
//   }, [filters, bookingData]);

//   const filteredData = useMemo(() => {
//     return bookingData.filter(booking => {
//       const matchesUsername = !filters.username || 
//         booking.UserInformation.Name.toLowerCase().includes(filters.username.toLowerCase());
//       const matchesPhone = !filters.phoneNumber || 
//         booking.UserInformation.Phonenumber.toString().includes(filters.phoneNumber);
//       const matchesStatus = filters.status === 'all' || booking.Status.toLowerCase() === filters.status.toLowerCase();
      
//       return matchesUsername && matchesPhone && matchesStatus;
//     });
//   }, [filters, bookingData]);

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'booked': return 'success';
//       case 'cancelled': return 'error';
//       case 'pending': return 'warning';
//       default: return 'default';
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   return (
//     <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
//           Booking Report Dashboard
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary">
//           Comprehensive overview of all bookings and revenue
//         </Typography>
//       </Box>

//       {/* Filters Section */}
//       <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <FilterList sx={{ mr: 1, color: '#1976d2' }} />
//           <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
//             Filters
//           </Typography>
//         </Box>
        
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               label="Start Date"
//               type="date"
//               value={filters.startDate}
//               onChange={(e) => setFilters({...filters, startDate: e.target.value})}
//               InputLabelProps={{ shrink: true }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <CalendarToday color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               label="End Date"
//               type="date"
//               value={filters.endDate}
//               onChange={(e) => setFilters({...filters, endDate: e.target.value})}
//               InputLabelProps={{ shrink: true }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <CalendarToday color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               label="Search by Username"
//               value={filters.username}
//               onChange={(e) => setFilters({...filters, username: e.target.value})}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Person color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               label="Search by Phone"
//               value={filters.phoneNumber}
//               onChange={(e) => setFilters({...filters, phoneNumber: e.target.value})}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Phone color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Statistics Cards */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <Box>
//                   <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
//                     {totals.totalBookings}
//                   </Typography>
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Total Bookings
//                   </Typography>
//                 </Box>
//                 <DateRange sx={{ fontSize: 40, opacity: 0.8 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <Box>
//                   <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
//                     {formatCurrency(totals.totalRevenue)}
//                   </Typography>
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Total Revenue
//                   </Typography>
//                 </Box>
//                 <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <Box>
//                   <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
//                     {formatCurrency(totals.totalTax)}
//                   </Typography>
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Total Tax
//                   </Typography>
//                 </Box>
//                 <CreditCard sx={{ fontSize: 40, opacity: 0.8 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <Box>
//                   <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
//                     {formatCurrency(totals.avgBookingValue)}
//                   </Typography>
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Avg Booking Value
//                   </Typography>
//                 </Box>
//                 <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Booking Details Table */}
//       <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
//         <Box sx={{ p: 3, backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
//           <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1976d2' }}>
//             Booking Details ({filteredData.length} records)
//           </Typography>
//         </Box>
        
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Guest Info</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Room Details</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Stay Period</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredData.map((booking) => (
//                 <TableRow key={booking._id} hover>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
//                         {booking.UserInformation.Name.charAt(0).toUpperCase()}
//                       </Avatar>
//                       <Box>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
//                           {booking.UserInformation.Name}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           📞 {booking.UserInformation.Phonenumber}
//                         </Typography>
//                         <br />
//                         <Typography variant="caption" color="text.secondary">
//                           Age: {booking.UserInformation.Age} | Children: {booking.Numberofchildren}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </TableCell>
                  
//                   <TableCell>
//                     <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'medium' }}>
//                       {booking.BookingId}
//                     </Typography>
//                     <Chip 
//                       label={booking.bookingtype} 
//                       size="small" 
//                       variant="outlined" 
//                       sx={{ mt: 0.5 }}
//                     />
//                   </TableCell>
                  
//                   <TableCell>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
//                       {booking.RoomId.RoomName}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Room #{booking.RoomId.RoomNo} | {booking.RoomId.numberofguest} guests
//                     </Typography>
//                     <br />
//                     <Typography variant="caption" sx={{ color: '#1976d2' }}>
//                       Base: {formatCurrency(booking.RoomId.Price)}
//                     </Typography>
//                   </TableCell>
                  
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
//                         📅 {formatDate(booking.CheckinDate)}
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
//                         📅 {formatDate(booking.CheckOutDate)}
//                       </Typography>
//                     </Box>
//                   </TableCell>
                  
//                   <TableCell>
//                     <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
//                       {formatCurrency(booking.TotalAmount)}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Tax: {formatCurrency(booking.Tax)}
//                     </Typography>
//                     {booking.PaymentId?.ExtraChargeAmount > 0 && (
//                       <>
//                         <br />
//                         <Typography variant="caption" color="warning.main">
//                           Extra: {formatCurrency(booking.PaymentId.ExtraChargeAmount)}
//                         </Typography>
//                       </>
//                     )}
//                   </TableCell>
                  
//                   <TableCell>
//                     <Chip 
//                       label={booking.Status} 
//                       color={getStatusColor(booking.Status)}
//                       variant="filled"
//                       sx={{ fontWeight: 'medium' }}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// };

// export default BookingReport;


import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  CalendarToday,
  Person,
  Phone,
  DateRange,
  TrendingUp,
  CreditCard,
  AttachMoney
} from '@mui/icons-material';
import { GetAllBookingApi } from '../../Api/Services/Payment';



const BookingReport = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    username: '',
    phoneNumber: '',
    status: 'all'
  });

  // Available status options
   const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'failed', label: 'Failed' },
    { value: 'Booked', label: 'Booked' },
    { value: 'checkin', label: 'Check In' },
    { value: 'checkout', label: 'Check Out' }
  ];

  // Fetch booking data
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GetAllBookingApi();
      
      if (response && response.success && response.data) {
        setBookingData(response.data);
      } else if (response && response.data) {
        setBookingData(Array.isArray(response.data) ? response.data : []);
      } else {
        setBookingData([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch booking data');
      setBookingData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Calculate totals
  const totals = useMemo(() => {
    const filtered = bookingData.filter(booking => {
      const matchesUsername = !filters.username || 
        booking.UserInformation?.Name?.toLowerCase().includes(filters.username.toLowerCase());
      const matchesPhone = !filters.phoneNumber || 
        booking.UserInformation?.Phonenumber?.toString().includes(filters.phoneNumber);
      const matchesStatus = filters.status === 'all' || booking.Status?.toLowerCase() === filters.status.toLowerCase();
      
      // Date filtering
      let matchesDateRange = true;
      if (filters.startDate || filters.endDate) {
        const checkinDate = new Date(booking.CheckinDate);
        if (filters.startDate) {
          matchesDateRange = matchesDateRange && checkinDate >= new Date(filters.startDate);
        }
        if (filters.endDate) {
          matchesDateRange = matchesDateRange && checkinDate <= new Date(filters.endDate);
        }
      }
      
      return matchesUsername && matchesPhone && matchesStatus && matchesDateRange;
    });

    return {
      totalBookings: filtered.length,
      totalRevenue: filtered.reduce((sum, booking) => sum + (booking.TotalAmount || 0), 0),
      totalTax: filtered.reduce((sum, booking) => sum + (booking.Tax || 0), 0),
      avgBookingValue: filtered.length > 0 ? 
        (filtered.reduce((sum, booking) => sum + (booking.TotalAmount || 0), 0) / filtered.length).toFixed(2) : 0
    };
  }, [filters, bookingData]);

  const filteredData = useMemo(() => {
    return bookingData.filter(booking => {
      const matchesUsername = !filters.username || 
        booking.UserInformation?.Name?.toLowerCase().includes(filters.username.toLowerCase());
      const matchesPhone = !filters.phoneNumber || 
        booking.UserInformation?.Phonenumber?.toString().includes(filters.phoneNumber);
      const matchesStatus = filters.status === 'all' || booking.Status?.toLowerCase() === filters.status.toLowerCase();
      
      // Date filtering
      let matchesDateRange = true;
      if (filters.startDate || filters.endDate) {
        const checkinDate = new Date(booking.CheckinDate);
        if (filters.startDate) {
          matchesDateRange = matchesDateRange && checkinDate >= new Date(filters.startDate);
        }
        if (filters.endDate) {
          matchesDateRange = matchesDateRange && checkinDate <= new Date(filters.endDate);
        }
      }
      
      return matchesUsername && matchesPhone && matchesStatus && matchesDateRange;
    });
  }, [filters, bookingData]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'booked': return 'success';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'checkedin': return 'info';
      case 'checkedout': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading booking data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <button onClick={fetchBookings} style={{ padding: '8px 16px', marginTop: '8px' }}>
          Retry
        </button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          Booking Report Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive overview of all bookings and revenue
        </Typography>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Filters
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Search by Username"
              value={filters.username}
              onChange={(e) => setFilters({...filters, username: e.target.value})}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Search by Phone"
              value={filters.phoneNumber}
              onChange={(e) => setFilters({...filters, phoneNumber: e.target.value})}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {totals.totalBookings}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Bookings
                  </Typography>
                </Box>
                <DateRange sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {formatCurrency(totals.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Revenue
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {formatCurrency(totals.totalTax)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Tax
                  </Typography>
                </Box>
                <CreditCard sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {formatCurrency(totals.avgBookingValue)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg Booking Value
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Details Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1976d2' }}>
            Booking Details ({filteredData.length} records)
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Guest Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Room Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Stay Period</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No bookings found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((booking) => (
                  <TableRow key={booking._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                          {booking.UserInformation?.Name?.charAt(0).toUpperCase() || 'G'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                            {booking.UserInformation?.Name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📞 {booking.UserInformation?.Phonenumber || 'N/A'}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            Age: {booking.UserInformation?.Age || 'N/A'} | Children: {booking.Numberofchildren || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'medium' }}>
                        {booking.BookingId || 'N/A'}
                      </Typography>
                      <Chip 
                        label={booking.bookingtype || 'N/A'} 
                        size="small" 
                        variant="outlined" 
                        sx={{ mt: 0.5 }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                        {booking.RoomId?.RoomName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Room #{booking.RoomId?.RoomNo || 'N/A'} | {booking.RoomId?.numberofguest || 0} guests
                      </Typography>
                      <br />
                      <Typography variant="caption" sx={{ color: '#1976d2' }}>
                        Base: {formatCurrency(booking.RoomId?.Price)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          📅 {formatDate(booking.CheckinDate)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          📅 {formatDate(booking.CheckOutDate)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        {formatCurrency(booking.TotalAmount)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tax: {formatCurrency(booking.Tax)}
                      </Typography>
                      {booking.PaymentId?.ExtraChargeAmount > 0 && (
                        <>
                          <br />
                          <Typography variant="caption" color="warning.main">
                            Extra: {formatCurrency(booking.PaymentId.ExtraChargeAmount)}
                          </Typography>
                        </>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={booking.Status || 'N/A'} 
                        color={getStatusColor(booking.Status)}
                        variant="filled"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BookingReport;