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
  Stack,
  CardMedia
} from '@mui/material';
import {
  Home,
  LocationOn,
  Phone,
  Email,
  Person,
  AttachMoney,
  CalendarToday,
  Bed,
  Bathtub,
  SquareFoot,
  LocalParking,
  Visibility,
  Edit,
  Share,
  Favorite,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp
} from '@mui/icons-material';

const ListProperty = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Static property data
  const availableProperties = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment",
      type: "Apartment",
      price: "₹45,00,000",
      rentPrice: "₹25,000/month",
      location: "Salt Lake City, Kolkata",
      address: "Block GE, Sector III, Salt Lake City",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700106",
      ownerName: "Rajesh Kumar",
      ownerPhone: "+91 98765 43210",
      ownerEmail: "rajesh.kumar@gmail.com",
      bedrooms: 3,
      bathrooms: 2,
      area: "1250 sq ft",
      parking: "Yes",
      furnished: "Semi-Furnished",
      status: "available",
      listedDate: "2024-05-15",
      propertyAge: "3 years",
      floor: "4th Floor",
      totalFloors: "8 floors",
      amenities: ["Gym", "Swimming Pool", "Security", "Power Backup"],
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Modern 2BHK Flat",
      type: "Flat",
      price: "₹28,00,000",
      rentPrice: "₹18,000/month",
      location: "Park Street, Kolkata",
      address: "21, Park Street, Near Metro Station",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700016",
      ownerName: "Priya Sengupta",
      ownerPhone: "+91 87654 32109",
      ownerEmail: "priya.sengupta@yahoo.com",
      bedrooms: 2,
      bathrooms: 2,
      area: "950 sq ft",
      parking: "No",
      furnished: "Fully Furnished",
      status: "rented",
      listedDate: "2024-05-10",
      propertyAge: "5 years",
      floor: "2nd Floor",
      totalFloors: "6 floors",
      amenities: ["Elevator", "Security", "Balcony"],
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Spacious Villa",
      type: "Villa",
      price: "₹1,20,00,000",
      rentPrice: "₹50,000/month",
      location: "New Town, Kolkata",
      address: "Plot 45, Action Area II, New Town",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700156",
      ownerName: "Amit Das",
      ownerPhone: "+91 90123 45678",
      ownerEmail: "amit.das@hotmail.com",
      bedrooms: 4,
      bathrooms: 3,
      area: "2400 sq ft",
      parking: "Yes (2 Cars)",
      furnished: "Unfurnished",
      status: "available",
      listedDate: "2024-05-20",
      propertyAge: "2 years",
      floor: "Ground + 1",
      totalFloors: "2 floors",
      amenities: ["Garden", "Parking", "Security", "Power Backup", "Water Tank"],
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"
    }
  ];

  const soldProperties = [
    {
      id: 4,
      title: "Cozy 1BHK Studio",
      type: "Studio",
      price: "₹18,00,000",
      rentPrice: "₹12,000/month",
      location: "Jadavpur, Kolkata",
      address: "78, Raja S.C. Mullick Road",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700032",
      ownerName: "Sunita Roy",
      ownerPhone: "+91 76543 21098",
      ownerEmail: "sunita.roy@gmail.com",
      bedrooms: 1,
      bathrooms: 1,
      area: "600 sq ft",
      parking: "No",
      furnished: "Semi-Furnished",
      status: "sold",
      listedDate: "2024-04-25",
      soldDate: "2024-05-28",
      propertyAge: "7 years",
      floor: "3rd Floor",
      totalFloors: "5 floors",
      amenities: ["Elevator", "Balcony"],
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
    }
  ];

  const rentedProperties = [
    {
      id: 5,
      title: "Executive 2BHK",
      type: "Apartment",
      price: "₹32,00,000",
      rentPrice: "₹22,000/month",
      location: "Ballygunge, Kolkata",
      address: "15, Ballygunge Circular Road",
      city: "Kolkata",
      state: "West Bengal",
      pinCode: "700019",
      ownerName: "Ravi Gupta",
      ownerPhone: "+91 98321 54760",
      ownerEmail: "ravi.gupta@outlook.com",
      bedrooms: 2,
      bathrooms: 2,
      area: "1100 sq ft",
      parking: "Yes",
      furnished: "Fully Furnished",
      status: "rented",
      listedDate: "2024-04-15",
      rentedDate: "2024-05-05",
      tenantName: "Arjun Sharma",
      propertyAge: "4 years",
      floor: "5th Floor",
      totalFloors: "7 floors",
      amenities: ["Gym", "Security", "Elevator", "Power Backup"],
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"
    }
  ];

  const allProperties = [...availableProperties, ...soldProperties, ...rentedProperties];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'sold':
        return 'info';
      case 'rented':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle />;
      case 'sold':
        return <TrendingUp />;
      case 'rented':
        return <Schedule />;
      default:
        return <Schedule />;
    }
  };

  const PropertyCard = ({ property }) => (
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
      <Grid container>
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            height="300"
            image={property.image}
            alt={property.title}
            sx={{ objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <CardContent sx={{ p: 3, height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                  <Home />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    {property.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.type} • Listed on {property.listedDate}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={getStatusIcon(property.status)}
                  label={property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  color={getStatusColor(property.status)}
                  variant="filled"
                  size="small"
                />
                <IconButton size="small" color="primary">
                  <Visibility />
                </IconButton>
                <IconButton size="small" color="primary">
                  <Edit />
                </IconButton>
                <IconButton size="small" color="primary">
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              {/* Price & Location */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  Price & Location
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoney sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {property.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rent: {property.rentPrice}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 20, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {property.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {property.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {property.city}, {property.state} - {property.pinCode}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>

              {/* Property Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  Property Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Bed sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                      <Typography variant="body2">{property.bedrooms} Bedrooms</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Bathtub sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                      <Typography variant="body2">{property.bathrooms} Bathrooms</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SquareFoot sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                      <Typography variant="body2">{property.area}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalParking sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                      <Typography variant="body2">{property.parking}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Floor:</strong> {property.floor} of {property.totalFloors}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Age:</strong> {property.propertyAge} • <strong>Furnished:</strong> {property.furnished}
                </Typography>
              </Grid>
            </Grid>

            {/* Owner Information & Amenities */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  Owner Information
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="medium">{property.ownerName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="body2">{property.ownerPhone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {property.ownerEmail}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                  Amenities
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {property.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                {property.tenantName && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="warning.main" fontWeight="bold">
                      Current Tenant: {property.tenantName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rented on: {property.rentedDate}
                    </Typography>
                  </Box>
                )}
                {property.soldDate && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="info.main" fontWeight="bold">
                      Sold on: {property.soldDate}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 3 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            Property Management Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your property listings and transactions
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">{availableProperties.length}</Typography>
              <Typography variant="body2">Available Properties</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">{rentedProperties.length}</Typography>
              <Typography variant="body2">Rented Properties</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">{soldProperties.length}</Typography>
              <Typography variant="body2">Sold Properties</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">{allProperties.length}</Typography>
              <Typography variant="body2">Total Properties</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
            aria-label="Property tabs"
          >
            <Tab 
              icon={<CheckCircle />} 
              label={
                <Badge badgeContent={availableProperties.length} color="success">
                  Available
                </Badge>
              }
              iconPosition="start"
            />
            <Tab 
              icon={<Schedule />} 
              label={
                <Badge badgeContent={rentedProperties.length} color="warning">
                  Rented
                </Badge>
              }
              iconPosition="start"
            />
            <Tab 
              icon={<TrendingUp />} 
              label={
                <Badge badgeContent={soldProperties.length} color="info">
                  Sold
                </Badge>
              }
              iconPosition="start"
            />
            <Tab 
              icon={<Home />} 
              label={
                <Badge badgeContent={allProperties.length} color="primary">
                  All Properties
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
                Available Properties ({availableProperties.length})
              </Typography>
              {availableProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Rented Properties ({rentedProperties.length})
              </Typography>
              {rentedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Sold Properties ({soldProperties.length})
              </Typography>
              {soldProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                All Properties ({allProperties.length})
              </Typography>
              {allProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ListProperty;

