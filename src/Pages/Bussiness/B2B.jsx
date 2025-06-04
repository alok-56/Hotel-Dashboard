import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Badge,
  Paper,
  IconButton,
  Stack
} from '@mui/material';
import {
  Business,
  Person,
  Phone,
  Email,
  LocationOn,
  Assignment,
  Today,
  AllInclusive,
  CheckCircle,
  Cancel,
  Schedule,
  CloudDownload,
  Visibility
} from '@mui/icons-material';

const B2B = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Static form submission data
  const todaySubmissions = [
    {
      id: 1,
      agencyName: "Wanderlust Travel Solutions",
      keyPerson: "Rajesh Kumar Sharma",
      contact: "+91 98765 43210",
      email: "contact@wanderlusttravel.com",
      address: "Plot No. 45, Sector 12, Salt Lake",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700091",
      bookingLocation: "Kolkata",
      previousBookings: "Yes",
      knowAnyone: "No",
      hearAbout: "Google Search",
      gstNumber: "19AABCU9603R1ZM",
      gstCertificate: "GST_Certificate_2024.pdf",
      submittedAt: "10:30 AM",
      status: "pending"
    },
    {
      id: 2,
      agencyName: "Royal Tours & Travels",
      keyPerson: "Priya Sengupta",
      contact: "+91 87654 32109",
      email: "info@royaltours.in",
      address: "15, Park Street, Near Metro Station",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700016",
      bookingLocation: "Darjeeling",
      previousBookings: "No",
      knowAnyone: "Yes",
      hearAbout: "Facebook Advertisement",
      gstNumber: "19BBDCS8791Q1ZX",
      gstCertificate: "Royal_GST_2024.pdf",
      submittedAt: "2:15 PM",
      status: "approved"
    },
    {
      id: 3,
      agencyName: "Bengal Adventure Tours",
      keyPerson: "Amit Das",
      contact: "+91 90123 45678",
      email: "bengaladventure@gmail.com",
      address: "78, Rashbehari Avenue",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700029",
      bookingLocation: "Siliguri",
      previousBookings: "Yes",
      knowAnyone: "No",
      hearAbout: "Word of Mouth",
      gstNumber: "19CCDFT5612P1AB",
      gstCertificate: "Bengal_GST_Cert.pdf",
      submittedAt: "4:45 PM",
      status: "reviewing"
    }
  ];

  const allSubmissions = [
    ...todaySubmissions,
    {
      id: 4,
      agencyName: "Himalayan Holidays",
      keyPerson: "Ravi Gupta",
      contact: "+91 98321 54760",
      email: "himalayan.holidays@yahoo.com",
      address: "23, AJC Bose Road",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700020",
      bookingLocation: "Digha",
      previousBookings: "No",
      knowAnyone: "Yes",
      hearAbout: "LinkedIn",
      gstNumber: "19DEFGH7890K1MN",
      gstCertificate: "Himalayan_GST.pdf",
      submittedAt: "Yesterday, 3:20 PM",
      status: "approved"
    },
    {
      id: 5,
      agencyName: "Eastern Expeditions",
      keyPerson: "Sunita Roy",
      contact: "+91 76543 21098",
      email: "eastern.exp@hotmail.com",
      address: "56, Shakespeare Sarani",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700017",
      bookingLocation: "Kolkata",
      previousBookings: "Yes",
      knowAnyone: "No",
      hearAbout: "Instagram",
      gstNumber: "19GHIJK1234L5OP",
      gstCertificate: "Eastern_GST_2024.pdf",
      submittedAt: "2 days ago, 11:15 AM",
      status: "rejected"
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'reviewing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Cancel />;
      case 'reviewing':
        return <Schedule />;
      default:
        return <Schedule />;
    }
  };

  const AgencyCard = ({ agency }) => (
    <Card 
      sx={{ 
        mb: 3, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: 3,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
              <Business />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {agency.agencyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted at {agency.submittedAt}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={getStatusIcon(agency.status)}
              label={agency.status.charAt(0).toUpperCase() + agency.status.slice(1)}
              color={getStatusColor(agency.status)}
              variant="filled"
              size="small"
            />
            <IconButton 
              size="small" 
              color="primary"
              aria-label={`View details for ${agency.agencyName}`}
            >
              <Visibility />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Content */}
        <Grid container spacing={3}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
              Contact Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Key Person</Typography>
                  <Typography variant="body2" fontWeight="medium">{agency.keyPerson}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" fontWeight="medium">{agency.contact}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
                    {agency.email}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Location Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
              Location Details
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 20, mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Address</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {agency.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agency.city}, {agency.state} - {agency.pinCode}
                  </Typography>
                </Box>
              </Box>
              <Paper sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                <Typography variant="body2" color="primary.main" fontWeight="bold">
                  Preferred Booking Location
                </Typography>
                <Typography variant="body2" color="primary.dark" fontWeight="medium">
                  {agency.bookingLocation}
                </Typography>
              </Paper>
            </Stack>
          </Grid>

          {/* Business Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
              Business Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">GST Number</Typography>
                  <Typography variant="body2" fontWeight="medium">{agency.gstNumber}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">GST Certificate</Typography>
                  <Typography variant="body2" fontWeight="medium">{agency.gstCertificate}</Typography>
                </Box>
                <IconButton 
                  size="small" 
                  color="primary"
                  aria-label={`Download ${agency.gstCertificate}`}
                >
                  <CloudDownload />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Previous Bookings: ${agency.previousBookings}`}
                  size="small"
                  color={agency.previousBookings === 'Yes' ? 'success' : 'default'}
                  variant="outlined"
                />
                <Chip
                  label={`Knows Someone: ${agency.knowAnyone}`}
                  size="small"
                  color={agency.knowAnyone === 'Yes' ? 'info' : 'default'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Heard About Us:</strong> {agency.hearAbout}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 3 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            B2B Agency Form Submissions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and review partnership applications from travel agencies
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">{todaySubmissions.length}</Typography>
              <Typography variant="body2">Today's Submissions</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">
                {allSubmissions.filter(s => s.status === 'approved').length}
              </Typography>
              <Typography variant="body2">Approved</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">
                {allSubmissions.filter(s => s.status === 'reviewing' || s.status === 'pending').length}
              </Typography>
              <Typography variant="body2">Under Review</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'error.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">
                {allSubmissions.filter(s => s.status === 'rejected').length}
              </Typography>
              <Typography variant="body2">Rejected</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
            aria-label="Submission tabs"
          >
            <Tab 
              icon={<Today />} 
              label={
                <Badge badgeContent={todaySubmissions.length} color="primary">
                  Today's Submissions
                </Badge>
              }
              iconPosition="start"
            />
            <Tab 
              icon={<AllInclusive />} 
              label={
                <Badge badgeContent={allSubmissions.length} color="secondary">
                  All Submissions
                </Badge>
              }
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Content */}
        <Box>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Today's Form Submissions ({todaySubmissions.length})
              </Typography>
              {todaySubmissions.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                All Form Submissions ({allSubmissions.length})
              </Typography>
              {allSubmissions.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default B2B;