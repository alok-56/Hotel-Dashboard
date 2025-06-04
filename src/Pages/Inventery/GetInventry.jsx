import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Stack,
  Alert
} from '@mui/material';
import {
  Hotel as HotelIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  BedOutlined as BedIcon
} from '@mui/icons-material';
import { GetRoomInventry, GetRoomInventryHotel } from '../../Api/Services/Rooms';

const GetInventry = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [inventoryData, setInventoryData] = useState({});
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load hotels on component mount
  useEffect(() => {
    loadHotels();
  }, []);

  // Load inventory data when hotel or date changes
  useEffect(() => {
    if (selectedHotel && selectedDate) {
      loadInventoryData();
    }
  }, [selectedHotel, selectedDate]);

  const loadHotels = async () => {
    try {
      setHotelsLoading(true);
      setError(null);
      const response = await GetRoomInventryHotel();
      
      if (response.success && response.data && response.data.branches) {
        const hotelsData = response.data.branches;
        setHotels(hotelsData);
        
        // Auto-select first hotel if available
        if (hotelsData.length > 0) {
          setSelectedHotel(hotelsData[0].branchId);
        }
      } else {
        setError('Failed to load hotels data');
      }
    } catch (error) {
      console.error('Error loading hotels:', error);
      setError('Failed to load hotels: ' + error.message);
    } finally {
      setHotelsLoading(false);
    }
  };

  const loadInventoryData = async () => {
    if (!selectedHotel || !selectedDate) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API with selected hotel and date
      const response = await GetRoomInventry(selectedHotel, selectedDate);
      
      if (response.success && response.data && response.data.inventory) {
        setInventoryData(response.data.inventory);
      } else {
        setError('Failed to load inventory data');
        setInventoryData({});
      }
    } catch (error) {
      console.error('Error loading inventory data:', error);
      setError('Failed to load inventory data: ' + error.message);
      setInventoryData({});
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar dates based on the inventory data or fallback to 7 days around selected date
  const getCalendarDates = () => {
    if (Object.keys(inventoryData).length > 0) {
      // Use dates from inventory data
      return Object.keys(inventoryData).sort().map(dateStr => new Date(dateStr));
    } else {
      // Fallback to 7 days around selected date
      const dates = [];
      const selectedDateObj = new Date(selectedDate);
      
      for (let i = -3; i <= 3; i++) {
        const date = new Date(selectedDateObj);
        date.setDate(selectedDateObj.getDate() + i);
        dates.push(date);
      }
      return dates;
    }
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return 'error';
    if (rate >= 70) return 'warning';
    if (rate >= 50) return 'info';
    return 'success';
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDisplayDate = (date) => {
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  };

  const calendarDates = getCalendarDates();
  const currentHotel = hotels.find(h => h.branchId === selectedHotel);

  if (hotelsLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={32} />
            <Typography color="text.secondary">Loading hotels...</Typography>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, elevation: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HotelIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                Hotel Inventory Dashboard
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
              onClick={loadInventoryData}
              disabled={loading || !selectedHotel}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3} alignItems="end">
            {/* Hotel Selector */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Select Hotel</InputLabel>
                <Select
                  value={selectedHotel}
                  label="Select Hotel"
                  onChange={(e) => setSelectedHotel(e.target.value)}
                  disabled={hotelsLoading}
                >
                  {hotels.map(hotel => (
                    <MenuItem key={hotel.branchId} value={hotel.branchId}>
                      <Box>
                        <Typography variant="body1">
                          {hotel.branchName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {hotel.branchLocation} • Total Rooms: {hotel.totalRooms}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Date Picker */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Select Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            {/* Hotel Info */}
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {currentHotel?.branchName || 'Select Hotel'}
                  </Typography>
                  <Typography variant="body2" color="primary.dark">
                    {currentHotel?.branchLocation || 'Location not specified'}
                    {currentHotel?.totalRooms && (
                      <><br />Total Capacity: {currentHotel.totalRooms} rooms</>
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Inventory Table */}
        <Paper sx={{ elevation: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 3, bgcolor: 'primary.50', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
              7-Day Inventory Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Room availability and occupancy rates for the selected period
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={32} />
                <Typography color="text.secondary">Loading inventory data...</Typography>
              </Stack>
            </Box>
          ) : !selectedHotel ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <Typography color="text.secondary">Please select a hotel to view inventory</Typography>
            </Box>
          ) : Object.keys(inventoryData).length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <Typography color="text.secondary">No inventory data available for the selected period</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ minWidth: 250, fontWeight: 'bold', fontSize: '1rem' }}>
                      Metrics
                    </TableCell>
                    {calendarDates.map(date => {
                      const displayDate = formatDisplayDate(date);
                      const todayHighlight = isToday(date);
                      
                      return (
                        <TableCell 
                          key={formatDate(date)} 
                          align="center" 
                          sx={{ 
                            minWidth: 120,
                            bgcolor: todayHighlight ? 'primary.100' : 'inherit',
                            fontWeight: 'bold'
                          }}
                        >
                          <Stack alignItems="center" spacing={0.5}>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                              {displayDate.weekday}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {displayDate.day}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {displayDate.month}
                            </Typography>
                          </Stack>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Total Rooms Row */}
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <BedIcon sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Total Rooms
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Hotel capacity
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    {calendarDates.map(date => {
                      const dateKey = formatDate(date);
                      const dayData = inventoryData[dateKey];
                      const todayHighlight = isToday(date);
                      
                      return (
                        <TableCell 
                          key={dateKey} 
                          align="center"
                          sx={{ bgcolor: todayHighlight ? 'primary.50' : 'inherit' }}
                        >
                          <Typography variant="h5" fontWeight="bold" color="text.primary">
                            {dayData?.totalRooms || '-'}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Sold Rooms Row */}
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <PeopleIcon sx={{ color: 'error.main' }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Sold Rooms
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Occupied rooms
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    {calendarDates.map(date => {
                      const dateKey = formatDate(date);
                      const dayData = inventoryData[dateKey];
                      const todayHighlight = isToday(date);
                      
                      return (
                        <TableCell 
                          key={dateKey} 
                          align="center"
                          sx={{ bgcolor: todayHighlight ? 'primary.50' : 'inherit' }}
                        >
                          <Typography variant="h5" fontWeight="bold" color="error.main">
                            {dayData?.soldRooms || '-'}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Available Rooms Row */}
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <BedIcon sx={{ color: 'success.main' }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Available Rooms
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rooms available for booking
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    {calendarDates.map(date => {
                      const dateKey = formatDate(date);
                      const dayData = inventoryData[dateKey];
                      const todayHighlight = isToday(date);
                      
                      return (
                        <TableCell 
                          key={dateKey} 
                          align="center"
                          sx={{ bgcolor: todayHighlight ? 'primary.50' : 'inherit' }}
                        >
                          <Typography variant="h5" fontWeight="bold" color="success.main">
                            {dayData?.availableRooms || '-'}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Occupancy Rate Row */}
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="caption" color="white" fontWeight="bold">
                            %
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Occupancy Rate
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Percentage occupied
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    {calendarDates.map(date => {
                      const dateKey = formatDate(date);
                      const dayData = inventoryData[dateKey];
                      const occupancyRate = dayData?.occupancyRate || 0;
                      const todayHighlight = isToday(date);
                      
                      return (
                        <TableCell 
                          key={dateKey} 
                          align="center"
                          sx={{ bgcolor: todayHighlight ? 'primary.50' : 'inherit' }}
                        >
                          <Chip 
                            label={`${occupancyRate}%`}
                            color={getOccupancyColor(occupancyRate)}
                            sx={{ fontWeight: 'bold', minWidth: 70 }}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Summary Cards */}
        {selectedHotel && !loading && Object.keys(inventoryData).length > 0 && (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {calendarDates.slice(0, 4).map(date => {
              const dateKey = formatDate(date);
              const dayData = inventoryData[dateKey];
              const occupancyRate = dayData?.occupancyRate || 0;
              const displayDate = formatDisplayDate(date);
              
              return (
                <Grid item xs={12} sm={6} md={3} key={dateKey}>
                  <Card sx={{ height: '100%', elevation: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {displayDate.weekday}, {displayDate.day} {displayDate.month}
                        </Typography>
                        <Chip 
                          label={`${occupancyRate}%`}
                          color={getOccupancyColor(occupancyRate)}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Day:</Typography>
                          <Typography variant="body2" fontWeight="bold">{dayData?.dayName || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Total Rooms:</Typography>
                          <Typography variant="body2" fontWeight="bold">{dayData?.totalRooms || 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Sold Rooms:</Typography>
                          <Typography variant="body2" fontWeight="bold" color="error.main">
                            {dayData?.soldRooms || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Available:</Typography>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {dayData?.availableRooms || 0}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default GetInventry;
